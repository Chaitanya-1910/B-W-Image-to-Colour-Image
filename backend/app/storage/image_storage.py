from pathlib import Path
from uuid import uuid4

from PIL import Image


class ImageStorage:
    def __init__(self, uploads_dir: Path, outputs_dir: Path) -> None:
        self.uploads_dir = uploads_dir
        self.outputs_dir = outputs_dir
        self.uploads_dir.mkdir(parents=True, exist_ok=True)
        self.outputs_dir.mkdir(parents=True, exist_ok=True)

    def save_upload(self, data: bytes, suffix: str) -> tuple[str, Path]:
        result_id = uuid4().hex
        path = self.uploads_dir / f"{result_id}{suffix}"
        path.write_bytes(data)
        return result_id, path

    def save_output(self, image: Image.Image, result_id: str) -> Path:
        path = self.outputs_dir / f"{result_id}.png"
        image.convert("RGB").save(path, format="PNG", optimize=True)
        return path
