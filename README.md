# B-W-Image-to-Colour-Image (ColorizeAI)

A premium React + FastAPI foundation for AI-powered image colorization. The current backend uses a clearly marked mock `ColorizationService`; it is ready for the OpenCV/Caffe inference implementation to be swapped in later.

## Frontend

```bash
npm install
npm run dev
```

The Vite app runs at `http://localhost:5173` and proxies `/api` and `/media` to FastAPI.

## Backend

Use Python 3.12 or 3.13 for the backend environment. The pinned Pillow/Pydantic/OpenCV stack is not available as a complete Windows wheel set for Python 3.14.

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

The API runs at `http://localhost:8000`. On macOS/Linux, activate the environment with `source .venv/bin/activate`.

## Configuration

Copy `.env.example` in the project root for `VITE_API_BASE_URL` when the API is hosted separately. Copy `backend/.env.example` to `backend/.env` to configure CORS and the local upload limit.

## API

- `GET /api/v1/health` returns `{ "status": "ok" }`.
- `POST /api/v1/colorize` accepts a multipart `file` field and returns the result id, original/output media URLs, processing time, and dimensions.
- Local files are written to `backend/uploads/` and `backend/outputs/`.

The API validates content type, extension, actual image bytes, size, and dimensions before processing. It never uses the client filename as a storage path.

## Model integration point

Replace `MockColorizationService` in `backend/app/services/colorization_service.py` with the real implementation while preserving `ColorizationService.colorize(image)`. The intended future pipeline is BGR -> LAB -> L channel -> deep-learning model -> predicted a/b channels -> LAB -> BGR. Expected model files are `colorization_deploy_v2.prototxt`, `colorization_release_v2.caffemodel`, and `pts_in_hull.npy`.

The frontend only consumes the API contract, so it does not need to change when the model is integrated.
