import time
import logging
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from app.core.config import Settings, get_settings
from app.schemas.colorization import ColorizationResponse
from app.services.colorization_service import OpenCVColorizationService
from app.storage.image_storage import ImageStorage
from app.utils.image_validation import validate_image

router = APIRouter()
logger = logging.getLogger(__name__)
service: OpenCVColorizationService | None = None
model_error: str | None = None
try:
    service = OpenCVColorizationService(Path(__file__).resolve().parents[3] / "models")
except Exception as error:
    model_error = str(error)
    logger.exception("Unable to load the colorization model")


@router.post("/colorize", response_model=ColorizationResponse)
async def colorize_image(file: UploadFile = File(...), settings: Settings = Depends(get_settings)) -> ColorizationResponse:
    started = time.perf_counter()
    data, image = await validate_image(file, settings.max_file_size_mb * 1024 * 1024)
    if service is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The colorization model is unavailable. Please try again later.",
        )
    suffix = Path(file.filename or ".png").suffix.lower()
    storage = ImageStorage(settings.uploads_dir, settings.outputs_dir)
    result_id, _ = storage.save_upload(data, suffix)
    try:
        colorized = service.colorize(image)
        storage.save_output(colorized, result_id)
    except Exception as error:
        logger.exception("Colorization failed for result %s", result_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="The image could not be colorized. Please try another image.",
        ) from error
    elapsed = round(time.perf_counter() - started, 3)
    return ColorizationResponse(
        result_id=result_id,
        status="completed",
        original_image_url=f"/media/uploads/{result_id}{suffix}",
        colorized_image_url=f"/media/outputs/{result_id}.png",
        processing_time=elapsed,
        width=image.width,
        height=image.height,
    )
