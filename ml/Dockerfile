FROM python:3.10-slim

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

# HuggingFace requires non-root user
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user PATH=/home/user/.local/bin:$PATH

WORKDIR /app

COPY --chown=user requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY --chown=user . /app

EXPOSE 7860
ENV PORT=7860

CMD ["gunicorn", "--bind", "0.0.0.0:7860", "--timeout", "120", "api.app:app"]
