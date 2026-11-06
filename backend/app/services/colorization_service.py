from abc import ABC, abstractmethod
from pathlib import Path

import cv2
import numpy as np
from PIL import Image


class ColorizationService(ABC):
    @abstractmethod
    def colorize(self, image: Image.Image) -> Image.Image:
        """Return a colorized image."""


class OpenCVColorizationService(ColorizationService):
    def __init__(self, model_dir: str | Path):
        model_dir = Path(model_dir).resolve()

        prototxt = model_dir / "colorization_deploy_v2.prototxt"
        caffemodel = model_dir / "colorization_release_v2.caffemodel"
        points_file = model_dir / "pts_in_hull.npy"

        # Check that all model files exist
        for path in (prototxt, caffemodel, points_file):
            if not path.exists():
                raise FileNotFoundError(
                    f"Model file not found: {path}"
                )

        # Load pretrained Caffe model
        self.net = cv2.dnn.readNetFromCaffe(
            str(prototxt),
            str(caffemodel)
        )

        # Load color cluster points
        pts = np.load(str(points_file))

        # Add color cluster centers to the model
        class8 = self.net.getLayerId("class8_ab")
        conv8 = self.net.getLayerId("conv8_313_rh")

        pts = pts.transpose().reshape(
            2,
            313,
            1,
            1
        )

        self.net.getLayer(class8).blobs = [
            pts.astype("float32")
        ]

        self.net.getLayer(conv8).blobs = [
            np.full(
                [1, 313],
                2.606,
                dtype="float32"
            )
        ]

        self.model_dir = model_dir

    def colorize(self, image: Image.Image) -> Image.Image:
        if image.width < 2 or image.height < 2:
            raise ValueError("The image is too small to colorize.")

        # PIL RGB → OpenCV BGR
        rgb = np.array(image.convert("RGB"))

        bgr = cv2.cvtColor(
            rgb,
            cv2.COLOR_RGB2BGR
        )

        # Scale to 0–1
        scaled = bgr.astype("float32") / 255.0

        # BGR → LAB
        lab = cv2.cvtColor(
            scaled,
            cv2.COLOR_BGR2LAB
        )

        # Resize for the neural network
        resized = cv2.resize(
            lab,
            (224, 224)
        )

        # Extract L channel
        L = cv2.split(resized)[0]

        # Mean subtraction
        L -= 50

        # Give L channel to neural network
        self.net.setInput(
            cv2.dnn.blobFromImage(L)
        )

        # Predict a and b channels
        ab = self.net.forward()[0]

        ab = ab.transpose(
            (1, 2, 0)
        )

        # Resize predicted channels to original image size
        ab = cv2.resize(
            ab,
            (bgr.shape[1], bgr.shape[0])
        )

        # Get original L channel
        original_L = cv2.split(lab)[0]

        # Combine L + predicted ab
        colorized_lab = np.concatenate(
            (
                original_L[:, :, np.newaxis],
                ab
            ),
            axis=2
        )

        # LAB → BGR
        colorized_bgr = cv2.cvtColor(
            colorized_lab,
            cv2.COLOR_LAB2BGR
        )

        # Clamp values
        colorized_bgr = np.clip(
            colorized_bgr,
            0,
            1
        )

        # Convert to 8-bit
        colorized_bgr = (
            colorized_bgr * 255
        ).astype("uint8")

        # BGR → RGB
        colorized_rgb = cv2.cvtColor(
            colorized_bgr,
            cv2.COLOR_BGR2RGB
        )

        # RGB → PIL Image
        return Image.fromarray(
            colorized_rgb
        )