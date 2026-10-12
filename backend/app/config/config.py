from pydantic import field_validator
from pydantic_settings import BaseSettings

DEFAULT_LLM_MODEL = "qwen3:1.7b"

class Settings(BaseSettings):
    database_url: str
    llm_model: str = DEFAULT_LLM_MODEL
    cors_origins: str = "http://localhost:5173"
    model_config = {"env_file": ".env"}

    @field_validator("llm_model", mode="before")
    @classmethod
    def use_default_for_empty_model(cls, value: str | None) -> str:
        if value is None or not str(value).strip():
            return DEFAULT_LLM_MODEL
        return str(value).strip()


settings = Settings()
