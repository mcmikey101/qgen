from pydantic import field_validator
from pydantic_settings import BaseSettings
from pathlib import Path

DEFAULT_LLM_MODEL = "qwen3:1.7b"

class Settings(BaseSettings):
    database_url: str
    llm_model: str = DEFAULT_LLM_MODEL
    cors_origins: str = "http://localhost:5173"
    jwt_secret: str = "change-this-development-secret"
    access_token_minutes: int = 15
    refresh_token_days: int = 7
    model_config = {"env_file": Path(__file__).resolve().parents[3] / ".env"}

    @field_validator("llm_model", mode="before")
    @classmethod
    def use_default_for_empty_model(cls, value: str | None) -> str:
        if value is None or not str(value).strip():
            return DEFAULT_LLM_MODEL
        return str(value).strip()


settings = Settings()
