# db-service/Dockerfile
FROM golang:1.23.8-alpine
WORKDIR /app

# Copy the whole repo so proto/ is accessible
COPY . .

WORKDIR /app/db-service
RUN go mod tidy && go build -o db-service

EXPOSE 50052
CMD ["./db-service"]
