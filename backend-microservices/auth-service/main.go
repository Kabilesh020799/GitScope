package main

import (
	"log"
	"net"

	"gitscope.com/backend-microservices/auth-service/server"
	authv1 "gitscope.com/backend-microservices/proto/auth/v1"
	"google.golang.org/grpc"
)

func main() {
	listener, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}
	grpcServer := grpc.NewServer()
	authv1.RegisterAuthServiceServer(grpcServer, server.NewAuthServer())
	log.Println("AuthService gRPC server running on :50051")
	if err := grpcServer.Serve(listener); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	}
}