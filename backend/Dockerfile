# Build container
FROM golang:1.23 AS builder
ENV GOTOOLCHAIN=auto

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o backend ./cmd/server

# Runtime container
FROM ubuntu:24.04

# Install ffmpeg, python3, pip, and yt-dlp
# yt-dlp requires ffmpeg for the audio format conversion
RUN apt-get update && \
    apt-get install -y ffmpeg ca-certificates python3 python3-pip && \
    pip install yt-dlp --break-system-packages && \
    update-ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Add fonts and rebuild font cache
COPY fonts /usr/share/fonts/vibreon/
RUN fc-cache -f -v

WORKDIR /app
COPY --from=builder /app/backend .

EXPOSE 8080

CMD ["./backend"]