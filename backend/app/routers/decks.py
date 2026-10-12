from typing import Annotated

from fastapi import APIRouter, Depends, Path, Query
from sqlalchemy.orm import Session

from app.routers import schemas
from app.db.database import get_db
from app.db.models import User
from app.db.current_user import get_current_user
from app.db import crud

router = APIRouter(prefix="/decks", tags=["decks"])


@router.post("", response_model=schemas.DeckOut, status_code=201)
def create_deck(data: schemas.DeckCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return crud.create_deck(db, user, data)


@router.get("", response_model=list[schemas.DeckOut])
def list_decks(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return crud.get_user_decks(db, user, skip, limit)


@router.get("/{deck_id}", response_model=schemas.DeckOut)
def get_deck(deck_id: Annotated[int, Path(gt=0)], db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return crud.get_own_deck(db, deck_id, user)


@router.patch("/{deck_id}", response_model=schemas.DeckOut)
def update_deck(
    deck_id: Annotated[int, Path(gt=0)],
    data: schemas.DeckUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    deck = crud.get_own_deck(db, deck_id, user)
    return crud.update_deck(db, deck, data)


@router.delete("/{deck_id}", status_code=204)
def delete_deck(deck_id: Annotated[int, Path(gt=0)], db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    deck = crud.get_own_deck(db, deck_id, user)
    crud.delete_deck(db, deck)
