# syntax=docker/dockerfile:1

FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    AI_OPERATIONS_ROOM_HOST=0.0.0.0 \
    AI_OPERATIONS_ROOM_DATA_DIR=/data

COPY pyproject.toml uv.lock ./
COPY backend ./backend
COPY frontend ./frontend
COPY hooks ./hooks

RUN uv sync --frozen --no-dev

EXPOSE 8765

VOLUME ["/data"]

CMD ["uv", "run", "python", "-m", "backend.cli", "serve", "--data-dir", "/data"]
