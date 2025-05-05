package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	authv1 "gitscope.com/backend-microservices/proto/auth/v1"
	"google.golang.org/grpc"
)

var authClient authv1.AuthServiceClient

func main() {
	conn, err := grpc.Dial("auth-service:50051", grpc.WithInsecure())
	if err != nil {
		log.Fatalf("Failed to connect to auth-service: %v", err)
	}
	authClient = authv1.NewAuthServiceClient(conn)

	http.HandleFunc("/signup", signupHandler)
	http.HandleFunc("/login", loginHandler)
	log.Println("API service running on :8080")
	http.ListenAndServe(":8080", nil)
}

func signupHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST allowed", http.StatusMethodNotAllowed)
		return
	}
	var req authv1.SignupRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}
	resp, err := authClient.Signup(context.Background(), &req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusConflict)
		return
	}
	w.Write([]byte(resp.Message))
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST allowed", http.StatusMethodNotAllowed)
		return
	}
	var req authv1.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}
	resp, err := authClient.Login(context.Background(), &req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	json.NewEncoder(w).Encode(map[string]any{"token": resp.Token})
}