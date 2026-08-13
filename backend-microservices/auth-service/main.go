package main

import (
	"context"
	"log"
	"net"
	"os"
	"os/signal"
	"syscall"
	"time"

	"gitscope.com/backend-microservices/auth-service/server"
	authv1 "gitscope.com/backend-microservices/proto/auth/v1"
	dbv1 "gitscope.com/backend-microservices/proto/db/v1"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

func main() {
	if err := server.ConfigureJWT(os.Getenv("JWT_SECRET")); err != nil {
		log.Fatal(err)
	}
	dbAddr := os.Getenv("DB_SERVICE_ADDR")
	if dbAddr == "" {
		dbAddr = "db-service:50052"
	}
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	dialCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
	conn, err := grpc.DialContext(dialCtx, dbAddr, grpc.WithTransportCredentials(insecure.NewCredentials()), grpc.WithBlock())
	cancel()
	if err != nil {
		log.Fatalf("connect to db service: %v", err)
	}
	defer conn.Close()
	listener, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("listen: %v", err)
	}
	g := grpc.NewServer()
	authv1.RegisterAuthServiceServer(g, server.NewAuthServer(dbv1.NewDBServiceClient(conn)))
	go func() { <-ctx.Done(); g.GracefulStop() }()
	log.Println("AuthService gRPC server running on :50051")
	if err := g.Serve(listener); err != nil {
		log.Printf("serve: %v", err)
	}
}
