FROM golang:1.23.8-alpine AS build

# Start at the root of the project so we can access proto
WORKDIR /app
COPY . .

# Switch into the auth-service folder to build
WORKDIR /app/auth-service

RUN go build -trimpath -o /auth-service

FROM alpine:3.21
RUN adduser -D -u 10001 app
COPY --from=build /auth-service /auth-service
USER app
EXPOSE 50051
CMD ["/auth-service"]
