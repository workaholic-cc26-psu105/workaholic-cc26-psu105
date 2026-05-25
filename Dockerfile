FROM python:3.10-slim

# Install system deps needed by some packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    git \
    curl \
    libsndfile1 \
    libstdc++6 \
    libgl1 \
    libxrender1 \
    libxext6 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python deps
COPY requirements.txt /app/requirements.txt
RUN python -m pip install --upgrade pip
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy project files after installing deps to use Docker cache efficiently
COPY . /app

EXPOSE 8080

ENV PORT=8080
CMD ["gunicorn", "--bind", "0.0.0.0:$PORT", "api.app:app"]
