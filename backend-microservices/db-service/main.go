package main

import (
	"context"
	"log"
	"net"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	dbv1 "gitscope.com/backend-microservices/proto/db/v1"
	"google.golang.org/grpc"
)

var conn *pgxpool.Pool

type DBServer struct {
	dbv1.UnimplementedDBServiceServer
}

func main() {
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		log.Fatal("DATABASE_URL environment variable not set")
	}

	log.Println("Connecting to database...")
	var err error
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	connectCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
	conn, err = pgxpool.New(connectCtx, databaseURL)
	cancel()
	if err != nil {
		log.Fatalf("DB connect error: %v", err)
	}

	defer conn.Close()
	pingCtx, pingCancel := context.WithTimeout(ctx, 5*time.Second)
	defer pingCancel()
	if err := conn.Ping(pingCtx); err != nil {
		log.Fatalf("DB ping error: %v", err)
	}
	log.Println("Connected to database")

	listener, err := net.Listen("tcp", ":50052")
	if err != nil {
		log.Fatalf("Listen failsed: %v", err)
	}

	grpcServer := grpc.NewServer()
	dbv1.RegisterDBServiceServer(grpcServer, &DBServer{})
	log.Println("DBService running on :50052")
	go func() { <-ctx.Done(); grpcServer.GracefulStop() }()
	if err := grpcServer.Serve(listener); err != nil {
		log.Printf("serve: %v", err)
	}
}

func (s *DBServer) ExistsUser(ctx context.Context, req *dbv1.ExistsUserRequest) (*dbv1.ExistsUserResponse, error) {
	var exists bool
	err := conn.QueryRow(ctx, "SELECT EXISTS (SELECT 1 FROM users WHERE username=$1)", req.Username).Scan(&exists)
	return &dbv1.ExistsUserResponse{Exists: exists}, err
}

func (s *DBServer) InsertUser(ctx context.Context, req *dbv1.InsertUserRequest) (*dbv1.InsertUserResponse, error) {
	_, err := conn.Exec(ctx, "INSERT INTO users (username, password) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING", req.Username, req.Password)
	return &dbv1.InsertUserResponse{}, err
}

func (s *DBServer) GetUserCredentials(ctx context.Context, req *dbv1.GetUserCredentialsRequest) (*dbv1.GetUserCredentialsResponse, error) {
	var hash string
	var id int32
	err := conn.QueryRow(ctx, "SELECT password, id FROM users WHERE username=$1", req.Username).Scan(&hash, &id)
	return &dbv1.GetUserCredentialsResponse{Password: hash, UserID: id}, err
}
