# syntax=docker/dockerfile:1
FROM golang:1.23.8-alpine AS build

WORKDIR /src

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /out/gitscope .

FROM alpine:3.21

RUN apk add --no-cache ca-certificates \
    && addgroup -S -g 10001 gitscope \
    && adduser -S -D -H -u 10001 -G gitscope gitscope

WORKDIR /app
COPY --from=build --chown=gitscope:gitscope /out/gitscope ./gitscope
COPY --chown=gitscope:gitscope migrations ./migrations

USER 10001:10001
EXPOSE 10000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD port="${ADDR:-:10000}"; port="${port##*:}"; wget -q -T 2 -O /dev/null "http://127.0.0.1:${port}/healthz" || exit 1

ENTRYPOINT ["/app/gitscope"]
