FROM golang:1.23.8-alpine
WORKDIR /app
COPY . .

WORKDIR /app/api-service
RUN go mod tidy && go build -o api-service

EXPOSE 8080
CMD ["./api-service"]