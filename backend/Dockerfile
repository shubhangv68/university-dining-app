FROM python:3.10-slim as poetry

RUN pip install poetry==1.8.2
ENV POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_VIRTUALENVS_CREATE=1 \
    POETRY_CACHE_DIR=/tmp/poetry_cache

# Set working directory
WORKDIR /app

COPY pyproject.toml poetry.lock README.md ./

FROM poetry as builder
# Install dependencies
RUN --mount=type=cache,target=$POETRY_CACHE_DIR \
    poetry install --no-root

FROM poetry as test-builder
# Install dependencies
RUN --mount=type=cache,target=$POETRY_CACHE_DIR \
    poetry install --no-root --with test


FROM python:3.10-slim as runtime

# Add python scripts to PATH
ENV VIRTUAL_ENV=/app/.venv \
    PATH="/app/.venv/bin:$PATH"

# Copy .venv from builder image
COPY --from=builder ${VIRTUAL_ENV} ${VIRTUAL_ENV}

# For server
EXPOSE 5000

# Tell Python to not generate .pyc
ENV PYTHONDONTWRITEBYTECODE 1
# Turn off buffering
ENV PYTHONUNBUFFERED 1

# Set working directory
WORKDIR /app

# Copy host files to working directory
COPY . .

# Start the Flask app
ENTRYPOINT ["gunicorn", "backend.app:create_app()"]

FROM python:3.10-slim as test

ENV VIRTUAL_ENV=/app/.venv \
    PATH="/app/.venv/bin:$PATH"
COPY --from=test-builder ${VIRTUAL_ENV} ${VIRTUAL_ENV}
EXPOSE 5000
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
# Set working directory
WORKDIR /app
COPY . .
ENTRYPOINT ["pytest"]
