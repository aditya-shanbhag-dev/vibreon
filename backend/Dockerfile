# Build container
FROM golang:1.23 AS builder
ENV GOTOOLCHAIN=auto

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o backend ./cmd/server

# Runtime container
FROM ubuntu:latest

RUN apt-get update && \
    apt-get install -y ffmpeg ca-certificates && \
    update-ca-certificates && \
    apt-get clean

# Add fonts and rebuild font cache
COPY fonts /usr/share/fonts/vibreon/
RUN fc-cache -f -v   

WORKDIR /app
COPY --from=builder /app/backend .

EXPOSE 8080

CMD ["./backend"]
