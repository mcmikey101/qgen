from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.routers import schemas
from app.db.models import Card, Deck, DeckTag, User


def get_own_deck(db: Session, deck_id: int, user: User) -> Deck:
    deck = db.get(Deck, deck_id)
    if deck is None or deck.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Deck not found")
    return deck


def get_readable_deck(db: Session, deck_id: int, user: User) -> Deck:
    deck = db.get(Deck, deck_id)
    if deck is None or (deck.owner_id != user.id and not deck.is_public):
        raise HTTPException(status_code=404, detail="Deck not found")
    return deck


def get_public_deck(db: Session, deck_id: int) -> Deck:
    deck = db.get(Deck, deck_id)
    if deck is None or not deck.is_public:
        raise HTTPException(status_code=404, detail="Deck not found")
    return deck


def create_deck(db: Session, user: User, data: schemas.DeckCreate) -> Deck:
    deck = Deck(owner_id=user.id, title=data.title, description=data.description, is_public=data.is_public)
    deck.tag_records = [DeckTag(value=tag) for tag in data.tags]
    db.add(deck)
    db.commit()
    db.refresh(deck)
    return deck


def get_user_decks(db: Session, user: User, skip: int, limit: int) -> list[Deck]:
    return (
        db.query(Deck)
        .filter(Deck.owner_id == user.id)
        .order_by(Deck.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def update_deck(db: Session, deck: Deck, data: schemas.DeckUpdate) -> Deck:
    updates = data.model_dump(exclude_unset=True)
    tags = updates.pop("tags", None)
    for field, value in updates.items():
        if value is not None:
            setattr(deck, field, value)
    if tags is not None:
        deck.tag_records = [DeckTag(value=tag) for tag in tags]
    db.commit()
    db.refresh(deck)
    return deck


def delete_deck(db: Session, deck: Deck) -> None:
    db.delete(deck)
    db.commit()


def get_public_decks(db: Session, search: str | None, tag: str | None, skip: int, limit: int) -> list[Deck]:
    query = db.query(Deck).filter(Deck.is_public.is_(True))
    if search:
        query = query.filter(Deck.title.ilike(f"%{search}%"))
    if tag:
        query = query.filter(Deck.tag_records.any(DeckTag.value.ilike(tag)))
    return query.order_by(Deck.id.desc()).offset(skip).limit(limit).all()


def fork_deck(db: Session, source: Deck, user: User) -> Deck:
    new_deck = Deck(owner_id=user.id, title=source.title, description=source.description, is_public=False)
    new_deck.tag_records = [DeckTag(value=tag) for tag in source.tags]
    db.add(new_deck)
    db.flush()

    for card in source.cards:
        db.add(Card(deck_id=new_deck.id, front=card.front, back=card.back))
    db.commit()
    db.refresh(new_deck)
    return new_deck


def get_deck_cards(db: Session, deck: Deck, skip: int, limit: int, search: str | None = None) -> list[Card]:
    query = db.query(Card).filter(Card.deck_id == deck.id)
    if search:
        pattern = f"%{search}%"
        query = query.filter((Card.front.ilike(pattern)) | (Card.back.ilike(pattern)))
    return query.order_by(Card.id).offset(skip).limit(limit).all()


def create_card(db: Session, deck: Deck, data: schemas.CardCreate) -> Card:
    card = Card(deck_id=deck.id, front=data.front, back=data.back)
    db.add(card)
    db.commit()
    db.refresh(card)
    return card


def create_cards_from_list(db: Session, deck: Deck, items: list[dict]) -> list[Card]:
    cards = [Card(deck_id=deck.id, front=item["front"], back=item["back"]) for item in items]
    db.add_all(cards)
    db.commit()
    for card in cards:
        db.refresh(card)
    return cards


def get_own_card(db: Session, card_id: int, user: User) -> Card:
    card = db.get(Card, card_id)
    if card is None or card.deck.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Card not found")
    return card


def update_card(db: Session, card: Card, data: schemas.CardUpdate) -> Card:
    for field, value in data.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(card, field, value)
    db.commit()
    db.refresh(card)
    return card


def delete_card(db: Session, card: Card) -> None:
    db.delete(card)
    db.commit()
