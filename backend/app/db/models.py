from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import relationship

from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    decks = relationship("Deck", back_populates="owner", cascade="all, delete-orphan")


class Deck(Base):
    __tablename__ = "decks"

    id = Column(Integer, primary_key=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, default="")
    is_public = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="decks")
    cards = relationship("Card", back_populates="deck", cascade="all, delete-orphan")
    tag_records = relationship("DeckTag", back_populates="deck", cascade="all, delete-orphan")

    @property
    def card_count(self):
        return len(self.cards)

    @property
    def owner_username(self):
        return self.owner.username

    @property
    def tags(self):
        return [tag.value for tag in self.tag_records]


class DeckTag(Base):
    __tablename__ = "deck_tags"
    __table_args__ = (UniqueConstraint("deck_id", "value", name="uq_deck_tag_value"),)

    id = Column(Integer, primary_key=True)
    deck_id = Column(Integer, ForeignKey("decks.id", ondelete="CASCADE"), nullable=False)
    value = Column(String(50), nullable=False)

    deck = relationship("Deck", back_populates="tag_records")


class Card(Base):
    __tablename__ = "cards"

    id = Column(Integer, primary_key=True)
    deck_id = Column(Integer, ForeignKey("decks.id", ondelete="CASCADE"), nullable=False)
    front = Column(Text, nullable=False)
    back = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    deck = relationship("Deck", back_populates="cards")
