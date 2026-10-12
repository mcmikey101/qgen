from typing import Annotated

from fastapi import APIRouter, Depends, File, HTTPException, Path, Query, UploadFile
from sqlalchemy.orm import Session

from app import llm
from app.db.database import get_db
from app.db.models import User
from app.db.current_user import get_current_user
from app.db import crud
from app.routers import schemas
from app.documents import extract_text, split_text

router = APIRouter(tags=["cards"])


@router.get("/decks/{deck_id}/cards", response_model=list[schemas.CardOut])
def list_cards(
    deck_id: Annotated[int, Path(gt=0)],
    search: str | None = Query(default=None, max_length=200),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    deck = crud.get_own_deck(db, deck_id, user)
    return crud.get_deck_cards(db, deck, skip, limit, search.strip() if search else None)


@router.post("/decks/{deck_id}/cards", response_model=schemas.CardOut, status_code=201)
def create_card(
    deck_id: Annotated[int, Path(gt=0)],
    data: schemas.CardCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    deck = crud.get_own_deck(db, deck_id, user)
    return crud.create_card(db, deck, data)


@router.post("/decks/{deck_id}/generate", response_model=list[schemas.CardOut], status_code=201)
def generate_cards(
    deck_id: Annotated[int, Path(gt=0)],
    data: schemas.GenerateRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    deck = crud.get_own_deck(db, deck_id, user)
    items = llm.generate_cards(deck.title, data.text, data.language, data.model)
    return crud.create_cards_from_list(db, deck, items.get("flashcards", []))


@router.post(
    "/decks/{deck_id}/generate-from-file",
    response_model=list[schemas.CardOut],
    status_code=201,
)
async def generate_cards_from_file(
    deck_id: Annotated[int, Path(gt=0)],
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    deck = crud.get_own_deck(db, deck_id, user)
    try:
        contents = await file.read(10 * 1024 * 1024 + 1)
        if len(contents) > 10 * 1024 * 1024:
            raise HTTPException(status_code=413, detail="File is larger than 10 MB")
        text = extract_text(file.filename or "", contents)
    finally:
        await file.close()

    chunks = split_text(text)
    if not chunks:
        raise HTTPException(status_code=422, detail="The file contains no readable text")

    flashcards: list[dict] = []
    for chunk in chunks:
        result = llm.generate_cards(deck.title, chunk)
        flashcards.extend(result.get("flashcards", []))
    return crud.create_cards_from_list(db, deck, flashcards)


@router.patch("/cards/{card_id}", response_model=schemas.CardOut)
def update_card(
    card_id: Annotated[int, Path(gt=0)],
    data: schemas.CardUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    card = crud.get_own_card(db, card_id, user)
    return crud.update_card(db, card, data)


@router.delete("/cards/{card_id}", status_code=204)
def delete_card(card_id: int = Path(gt=0), db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    card = crud.get_own_card(db, card_id, user)
    crud.delete_card(db, card)
