from datetime import datetime, timedelta, timezone
from uuid import uuid4

import jwt
from fastapi import APIRouter, Depends, HTTPException
from pwdlib import PasswordHash
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.config.config import settings
from app.db.current_user import get_current_user
from app.db.database import get_db
from app.db.models import RefreshSession, User

router = APIRouter(prefix="/auth", tags=["auth"])
password_hash = PasswordHash.recommended()


class Credentials(BaseModel):
    username: str = Field(min_length=3, max_length=50, pattern=r"^[a-zA-Z0-9_.-]+$")
    password: str = Field(min_length=8, max_length=128)


class RefreshRequest(BaseModel):
    refresh_token: str


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: int
    username: str
    created_at: datetime

    class Config:
        from_attributes = True


def issue_pair(db: Session, user: User) -> TokenPair:
    now = datetime.now(timezone.utc)
    access = jwt.encode({"sub": str(user.id), "type": "access", "iat": now, "exp": now + timedelta(minutes=settings.access_token_minutes)}, settings.jwt_secret, algorithm="HS256")
    jti = str(uuid4())
    expires = now + timedelta(days=settings.refresh_token_days)
    refresh = jwt.encode({"sub": str(user.id), "type": "refresh", "jti": jti, "iat": now, "exp": expires}, settings.jwt_secret, algorithm="HS256")
    db.add(RefreshSession(token_jti=jti, user_id=user.id, expires_at=expires.replace(tzinfo=None)))
    db.commit()
    return TokenPair(access_token=access, refresh_token=refresh)


@router.post("/register", response_model=TokenPair, status_code=201)
def register(data: Credentials, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == data.username).first():
        raise HTTPException(status_code=409, detail="Username already exists")
    user = User(username=data.username, password_hash=password_hash.hash(data.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return issue_pair(db, user)


@router.post("/login", response_model=TokenPair)
def login(data: Credentials, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    if user is None or not user.password_hash or not password_hash.verify(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return issue_pair(db, user)


@router.post("/refresh", response_model=TokenPair)
def refresh(data: RefreshRequest, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(data.refresh_token, settings.jwt_secret, algorithms=["HS256"])
        if payload.get("type") != "refresh":
            raise ValueError
        session = db.query(RefreshSession).filter(RefreshSession.token_jti == payload["jti"]).first()
        if session is None or session.revoked or session.expires_at <= datetime.utcnow() or session.user_id != int(payload["sub"]):
            raise ValueError
    except (jwt.InvalidTokenError, ValueError, KeyError, TypeError):
        raise HTTPException(status_code=401, detail="Invalid, expired, or revoked refresh token")
    session.revoked = True
    db.commit()
    return issue_pair(db, session.user)


@router.post("/logout", status_code=204)
def logout(data: RefreshRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    try:
        payload = jwt.decode(data.refresh_token, settings.jwt_secret, algorithms=["HS256"])
        if payload.get("type") != "refresh" or int(payload.get("sub", 0)) != user.id:
            raise ValueError
        session = db.query(RefreshSession).filter(RefreshSession.token_jti == payload["jti"], RefreshSession.user_id == user.id).first()
    except (jwt.InvalidTokenError, ValueError, KeyError, TypeError):
        session = None
    if session:
        session.revoked = True
        db.commit()


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    return user


@router.delete("/me", status_code=204)
def delete_account(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    db.delete(user)
    db.commit()
