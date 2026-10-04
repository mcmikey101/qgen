import html

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import schemas
from app.db.database import get_db
from app.models import User
from app.db.current_user import get_current_user
from app.db import crud

router = APIRouter(tags=["export"])


@router.get("/decks/{deck_id}/export/anki", response_model=schemas.AnkiExport)
def export_anki(deck_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    deck = crud.get_readable_deck(db, deck_id, user)

    notes = []
    for card in deck.cards:
        notes.append(
            {
                "deckName": deck.title,
                "modelName": "Basic",
                "fields": {
                    "Front": html.escape(card.front).replace("\n", "<br>"),
                    "Back": html.escape(card.back).replace("\n", "<br>"),
                },
            }
        )
    return {"deckName": deck.title, "notes": notes}
