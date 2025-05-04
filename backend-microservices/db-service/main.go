package main

import (
	"context"
	"log"
	"net"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	dbv1 "gitscope.com/backend-microservices/proto/db/v1"
	"google.golang.org/grpc"
)

var conn *pgxpool.Pool

type DBServer struct {
	dbv1.UnimplementedDBServiceServer
}

func main() {
	var err error
	conn, err = pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))

	if err != nil {
		log.Fatalf("DB connect error: %v", err)
	}

	listener, err := net.Listen("tcp", ":50052")
	if err != nil {
		log.Fatalf("Listen failsed: %v", err)
	}

	grpcServer := grpc.NewServer()
	dbv1.RegisterDBServiceServer(grpcServer, &DBServer{})
	log.Println("DBService running on :50052")
	grpcServer.Serve(listener)	
}

func (s *DBServer) ExistsUser(ctx context.Context, req *dbv1.ExistsUserRequest) (*dbv1.ExistsUserResponse, error) {
	var exists bool
	err := conn.QueryRow(ctx, "SELECT EXISTS (SELECT 1 FROM users WHERE username=$1)", req.Username).Scan(&exists)
	return &dbv1.ExistsUserResponse{Exists: exists}, err
}

func (s *DBServer) InsertUser(ctx context.Context, req *dbv1.InsertUserRequest) (*dbv1.InsertUserResponse, error) {
	_, err := conn.Exec(ctx, "INSERT INTO users (username, password) VALUES ($1, $2)", req.Username, req.Password)
	return &dbv1.InsertUserResponse{}, err
}

func (s *DBServer) GetUserCredentials(ctx context.Context, req *dbv1.GetUserCredentialsRequest) (*dbv1.GetUserCredentialsResponse, error) {
	var hash string
	var id int32
	err := conn.QueryRow(ctx, "SELECT password, id FROM users WHERE username=$1", req.Username).Scan(&hash, &id)
	return &dbv1.GetUserCredentialsResponse{Password: hash, UserID: id}, err
}
