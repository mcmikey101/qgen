from typing import Annotated

from fastapi import APIRouter, Depends, Path, Query
from sqlalchemy.orm import Session

from app.routers import schemas
from app.db.database import get_db
from app.db.models import User
from app.db.current_user import get_current_user
from app.db import crud

router = APIRouter(prefix="/public/decks", tags=["public"])


@router.get("", response_model=list[schemas.PublicDeckOut])
def list_public_decks(
    search: str | None = Query(default=None, max_length=200),
    tag: str | None = Query(default=None, max_length=50),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return crud.get_public_decks(db, search.strip() if search else None, tag.strip() if tag else None, skip, limit)


@router.get("/{deck_id}", response_model=schemas.PublicDeckDetail)
def get_public_deck(deck_id: Annotated[int, Path(gt=0)], db: Session = Depends(get_db)):
    return crud.get_public_deck(db, deck_id)


@router.post("/{deck_id}/fork", response_model=schemas.DeckOut, status_code=201)
def fork_public_deck(deck_id: Annotated[int, Path(gt=0)], db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    source = crud.get_public_deck(db, deck_id)
    return crud.fork_deck(db, source, user)
