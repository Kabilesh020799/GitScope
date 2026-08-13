FROM golang:1.23.8-alpine AS build
WORKDIR /app
COPY .. .

WORKDIR /app/api-service
RUN go build -trimpath -o /api-service

FROM alpine:3.21
RUN adduser -D -u 10001 app
COPY --from=build /api-service /api-service
USER app
EXPOSE 8080
CMD ["/api-service"]
