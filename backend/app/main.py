from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.config import settings
from app.db.database import Base, engine
from app.routers import cards, decks, export, public

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Flashcards API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.cors_origins.split(",")],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(decks.router)
app.include_router(cards.router)
app.include_router(public.router)
app.include_router(export.router)
