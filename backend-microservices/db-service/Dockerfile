# db-service/Dockerfile
FROM golang:1.23.8-alpine AS build
WORKDIR /app

# Copy the whole repo so proto/ is accessible
COPY . .

WORKDIR /app/db-service
RUN go build -trimpath -o /db-service

FROM alpine:3.21
RUN adduser -D -u 10001 app
COPY --from=build /db-service /db-service
USER app
EXPOSE 50052
CMD ["/db-service"]
