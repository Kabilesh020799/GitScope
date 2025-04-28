package db

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5"
)

var Conn *pgx.Conn

func Connect() error {
	databaseUrl := os.Getenv("DATABASE_URL")
	if databaseUrl == "" {
		return fmt.Errorf("DATABASE_URL is not set")
	}

	conn, err := pgx.Connect(context.Background(), databaseUrl)
	if err != nil {
		return fmt.Errorf("failed to connect to database: %w", err)
	}

	Conn = conn
	fmt.Println("Connected to Neon DB")
	return nil
}