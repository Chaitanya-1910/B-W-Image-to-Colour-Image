from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.routes import colorize, health
from app.core.config import get_settings

settings = get_settings()
app = FastAPI(title="ColorizeAI API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/media", StaticFiles(directory=str(settings.uploads_dir.parent)), name="media")
app.include_router(health.router, prefix="/api/v1")
app.include_router(colorize.router, prefix="/api/v1")
