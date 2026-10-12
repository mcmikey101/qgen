from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

class APIModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class CardCreate(APIModel):
    front: str = Field(min_length=1, max_length=5000)
    back: str = Field(min_length=1, max_length=5000)

    @field_validator("front", "back")
    @classmethod
    def trim_card_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Card text must not be blank")
        return value


class CardUpdate(APIModel):
    front: str | None = Field(default=None, min_length=1, max_length=5000)
    back: str | None = Field(default=None, min_length=1, max_length=5000)

    @field_validator("front", "back")
    @classmethod
    def trim_updated_text(cls, value: str | None) -> str | None:
        if value is None:
            return value
        value = value.strip()
        if not value:
            raise ValueError("Card text must not be blank")
        return value

    @model_validator(mode="after")
    def require_a_change(self):
        if not self.model_fields_set or all(getattr(self, field) is None for field in self.model_fields_set):
            raise ValueError("At least one card field must be provided")
        return self


class CardOut(APIModel):
    id: int
    deck_id: int
    front: str
    back: str

    model_config = {"from_attributes": True}


class GenerateRequest(APIModel):
    text: str = Field(min_length=1, max_length=20000)
    language: str | None = Field(default=None, max_length=50)
    model: str | None = Field(default=None, max_length=100)

    @field_validator("text")
    @classmethod
    def trim_source_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Text must not be blank")
        return value

    @field_validator("model", mode="before")
    @classmethod
    def normalize_model(cls, value: str | None) -> str | None:
        if value is None:
            return None
        if not isinstance(value, str):
            return value
        value = value.strip()
        return value or None


class GeneratedCard(APIModel):
    front: str = Field(min_length=1, max_length=5000)
    back: str = Field(min_length=1, max_length=5000)
    tags: list[str] = Field(default_factory=list, max_length=30)
    source_excerpt: str = Field(min_length=1, max_length=12000)

    @field_validator("front", "back", "source_excerpt")
    @classmethod
    def trim_generated_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Generated text must not be blank")
        return value


class GenerationResult(APIModel):
    deck_name: str = Field(min_length=1, max_length=200)
    flashcards: list[GeneratedCard] = Field(max_length=500)


class DeckCreate(APIModel):
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(default="", max_length=2000)
    is_public: bool = False
    tags: list[str] = Field(default_factory=list, max_length=30)

    @field_validator("title")
    @classmethod
    def trim_title(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Title must not be blank")
        return value

    @field_validator("description")
    @classmethod
    def trim_description(cls, value: str) -> str:
        return value.strip()

    @field_validator("tags")
    @classmethod
    def normalize_tags(cls, values: list[str]) -> list[str]:
        normalized = list(dict.fromkeys(tag.strip() for tag in values if tag.strip()))
        if any(len(tag) > 50 for tag in normalized):
            raise ValueError("Tags may not exceed 50 characters")
        return normalized


class DeckUpdate(APIModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=2000)
    is_public: bool | None = None
    tags: list[str] | None = Field(default=None, max_length=30)

    @field_validator("title")
    @classmethod
    def trim_updated_title(cls, value: str | None) -> str | None:
        if value is None:
            return None
        value = value.strip()
        if not value:
            raise ValueError("Title must not be blank")
        return value

    @field_validator("description")
    @classmethod
    def trim_updated_description(cls, value: str | None) -> str | None:
        return value.strip() if value is not None else None

    @field_validator("tags")
    @classmethod
    def normalize_updated_tags(cls, values: list[str] | None) -> list[str] | None:
        if values is None:
            return None
        normalized = list(dict.fromkeys(tag.strip() for tag in values if tag.strip()))
        if any(len(tag) > 50 for tag in normalized):
            raise ValueError("Tags may not exceed 50 characters")
        return normalized

    @model_validator(mode="after")
    def require_a_change(self):
        if not self.model_fields_set or all(getattr(self, field) is None for field in self.model_fields_set):
            raise ValueError("At least one deck field must be provided")
        return self


class DeckOut(APIModel):
    id: int
    title: str
    description: str
    is_public: bool
    card_count: int
    tags: list[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class PublicDeckOut(DeckOut):
    owner_username: str


class PublicDeckDetail(PublicDeckOut):
    cards: list[CardOut]


class AnkiNote(APIModel):
    deckName: str
    modelName: str = "Basic"
    fields: dict[str, str]


class AnkiExport(APIModel):
    deckName: str
    notes: list[AnkiNote]
