from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import llm, schemas
from app.db.database import get_db
from app.models import User
from app.db.current_user import get_current_user
from app.db import crud

router = APIRouter(tags=["cards"])


@router.get("/decks/{deck_id}/cards", response_model=list[schemas.CardOut])
def list_cards(
    deck_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    deck = crud.get_own_deck(db, deck_id, user)
    return crud.get_deck_cards(db, deck, skip, limit)


@router.post("/decks/{deck_id}/cards", response_model=schemas.CardOut, status_code=201)
def create_card(
    deck_id: int,
    data: schemas.CardCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    deck = crud.get_own_deck(db, deck_id, user)
    return crud.create_card(db, deck, data)


@router.post("/decks/{deck_id}/generate", response_model=list[schemas.CardOut], status_code=201)
def generate_cards(
    deck_id: int,
    data: schemas.GenerateRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    deck = crud.get_own_deck(db, deck_id, user)
    items = llm.generate_cards(data.text, data.card_count, data.language)
    return crud.create_cards_from_list(db, deck, items)


@router.patch("/cards/{card_id}", response_model=schemas.CardOut)
def update_card(
    card_id: int,
    data: schemas.CardUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    card = crud.get_own_card(db, card_id, user)
    return crud.update_card(db, card, data)


@router.delete("/cards/{card_id}", status_code=204)
def delete_card(card_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    card = crud.get_own_card(db, card_id, user)
    crud.delete_card(db, card)
