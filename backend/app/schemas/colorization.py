from typing import Literal

from pydantic import BaseModel


class ColorizationResponse(BaseModel):
    result_id: str
    status: Literal["completed"]
    original_image_url: str
    colorized_image_url: str
    processing_time: float
    width: int
    height: int


class ErrorResponse(BaseModel):
    detail: str
