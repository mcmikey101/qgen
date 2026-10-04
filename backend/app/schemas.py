from datetime import datetime

from pydantic import BaseModel, Field


class CardCreate(BaseModel):
    front: str = Field(min_length=1, max_length=5000)
    back: str = Field(min_length=1, max_length=5000)


class CardUpdate(BaseModel):
    front: str | None = Field(default=None, min_length=1, max_length=5000)
    back: str | None = Field(default=None, min_length=1, max_length=5000)


class CardOut(BaseModel):
    id: int
    deck_id: int
    front: str
    back: str

    model_config = {"from_attributes": True}


class GenerateRequest(BaseModel):
    text: str = Field(min_length=1, max_length=20000)
    card_count: int = Field(default=10, ge=1, le=50)
    language: str | None = Field(default=None, max_length=50)


class DeckCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(default="", max_length=2000)
    is_public: bool = False


class DeckUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=2000)
    is_public: bool | None = None


class DeckOut(BaseModel):
    id: int
    title: str
    description: str
    is_public: bool
    card_count: int
    created_at: datetime

    model_config = {"from_attributes": True}


class PublicDeckOut(DeckOut):
    owner_username: str


class PublicDeckDetail(PublicDeckOut):
    cards: list[CardOut]


class AnkiNote(BaseModel):
    deckName: str
    modelName: str = "Basic"
    fields: dict[str, str]


class AnkiExport(BaseModel):
    deckName: str
    notes: list[AnkiNote]
