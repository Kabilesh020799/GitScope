FROM golang:1.23.8-alpine

# Start at the root of the project so we can access proto
WORKDIR /app
COPY . .

# Switch into the auth-service folder to build
WORKDIR /app/auth-service

RUN go mod tidy && go build -o auth-service

EXPOSE 50051
CMD ["./auth-service"]
