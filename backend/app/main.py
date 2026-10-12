
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ollama import AsyncClient

from app.config.config import settings
from app.db.database import Base, engine
from app.routers import cards, decks, export, public

MODEL = settings.llm_model

@asynccontextmanager
async def lifespan(app: FastAPI):
    client = AsyncClient()
    await client.generate(
        model=MODEL,
        prompt="",
        keep_alive=-1,
    )
    app.state.ollama = client
    yield

    await client.generate(
        model=MODEL,
        prompt="",
        keep_alive=0,
    )


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Flashcards API",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin.strip()
        for origin in settings.cors_origins.split(",")
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(decks.router)
app.include_router(cards.router)
app.include_router(public.router)
app.include_router(export.router)
