from fastapi import Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import User


def get_current_user(db: Session = Depends(get_db)) -> User:
    user = db.query(User).filter(User.username == "demo").first()
    if user is None:
        user = User(username="demo")
        db.add(user)
        db.commit()
        db.refresh(user)
    return user
