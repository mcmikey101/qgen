from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    llm_api_key: str = ""
    llm_base_url: str = ""
    llm_model: str = ""
    cors_origins: str = "http://localhost:5173"

    model_config = {"env_file": ".env"}


settings = Settings()
