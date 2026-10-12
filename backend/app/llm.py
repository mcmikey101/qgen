import json
from fastapi import HTTPException

from app.config.config import settings
import ollama
from pathlib import Path
from pydantic import ValidationError

from app.routers.schemas import GenerationResult

BASE_DIR = Path(__file__).resolve().parent
PROMPT_PATH = BASE_DIR / "sysprompt.md"

def generate_cards(
    deck_name: str,
    text: str,
    language: str | None = None,
    model: str | None = None,
) -> dict:

    with open(PROMPT_PATH, "r", encoding="utf-8") as f:
        syspropmt = f.read()

    schema = {
        "type": "object",
        "properties": {
            "deck_name": {"type": "string"},
            "flashcards": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "front": {"type": "string"},
                        "back": {"type": "string"},
                        "tags": {
                            "type": "array",
                            "items": {"type": "string"}
                        },
                        "source_excerpt": {"type": "string"}
                    },
                    "required": [
                        "front",
                        "back",
                        "tags",
                        "source_excerpt"
                    ],
                    "additionalProperties": False
                }
            }
        },
        "required": ["deck_name", "flashcards"],
        "additionalProperties": False
    }

    language_instruction = f" Язык карточек: {language}." if language else ""
    try:
        response = ollama.chat(
            model=model or settings.llm_model,
            messages=[
                {"role": "system", "content": syspropmt},
                {
                    "role": "user",
                    "content": f"Название колоды: '{deck_name}'.{language_instruction} Текст для конвертации: '{text}'",
                },
            ],
            format=schema,
        )
        result = GenerationResult.model_validate(json.loads(response.message.content))
    except (json.JSONDecodeError, ValidationError, AttributeError, KeyError, TypeError) as exc:
        raise HTTPException(status_code=502, detail="Language model returned invalid card data") from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail="Language model request failed") from exc

    return result.model_dump()
