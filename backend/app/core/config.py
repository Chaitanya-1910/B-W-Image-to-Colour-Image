from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    cors_origins: str = "http://localhost:5173"
    max_file_size_mb: int = 10
    uploads_dir: Path = BACKEND_DIR / "uploads"
    outputs_dir: Path = BACKEND_DIR / "outputs"

    model_config = SettingsConfigDict(env_file=BACKEND_DIR / ".env", extra="ignore")

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    settings = Settings()
    if not settings.uploads_dir.is_absolute():
        settings.uploads_dir = BACKEND_DIR / settings.uploads_dir
    if not settings.outputs_dir.is_absolute():
        settings.outputs_dir = BACKEND_DIR / settings.outputs_dir
    settings.uploads_dir.mkdir(parents=True, exist_ok=True)
    settings.outputs_dir.mkdir(parents=True, exist_ok=True)
    return settings
