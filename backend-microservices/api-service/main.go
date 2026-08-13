package main

import (
	"context"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	authv1 "gitscope.com/backend-microservices/proto/auth/v1"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/status"
)

var authClient authv1.AuthServiceClient

func main() {
	addr := os.Getenv("AUTH_SERVICE_ADDR")
	if addr == "" {
		addr = "auth-service:50051"
	}
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	dialCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
	conn, err := grpc.DialContext(dialCtx, addr, grpc.WithTransportCredentials(insecure.NewCredentials()), grpc.WithBlock())
	cancel()
	if err != nil {
		log.Fatalf("connect to auth service: %v", err)
	}
	defer conn.Close()
	authClient = authv1.NewAuthServiceClient(conn)
	mux := http.NewServeMux()
	mux.HandleFunc("/signup", signupHandler)
	mux.HandleFunc("/login", loginHandler)
	mux.HandleFunc("/healthz", func(w http.ResponseWriter, _ *http.Request) { w.WriteHeader(http.StatusNoContent) })
	srv := &http.Server{Addr: ":8080", Handler: mux, ReadHeaderTimeout: 5 * time.Second, ReadTimeout: 15 * time.Second, WriteTimeout: 15 * time.Second, IdleTimeout: 60 * time.Second}
	go func() {
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("server: %v", err)
		}
	}()
	<-ctx.Done()
	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer shutdownCancel()
	_ = srv.Shutdown(shutdownCtx)
}

func decode(w http.ResponseWriter, r *http.Request, out any) bool {
	if r.Method != http.MethodPost {
		w.Header().Set("Allow", http.MethodPost)
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return false
	}
	r.Body = http.MaxBytesReader(w, r.Body, 16<<10)
	d := json.NewDecoder(r.Body)
	d.DisallowUnknownFields()
	if err := d.Decode(out); err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return false
	}
	return true
}
func rpcContext(r *http.Request) (context.Context, context.CancelFunc) {
	return context.WithTimeout(r.Context(), 8*time.Second)
}
func signupHandler(w http.ResponseWriter, r *http.Request) {
	var req authv1.SignupRequest
	if !decode(w, r, &req) {
		return
	}
	ctx, cancel := rpcContext(r)
	defer cancel()
	resp, err := authClient.Signup(ctx, &req)
	if err != nil {
		writeRPCError(w, err)
		return
	}
	w.WriteHeader(http.StatusCreated)
	_ = json.NewEncoder(w).Encode(map[string]string{"message": resp.Message})
}
func loginHandler(w http.ResponseWriter, r *http.Request) {
	var req authv1.LoginRequest
	if !decode(w, r, &req) {
		return
	}
	ctx, cancel := rpcContext(r)
	defer cancel()
	resp, err := authClient.Login(ctx, &req)
	if err != nil {
		writeRPCError(w, err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]string{"token": resp.Token})
}
func writeRPCError(w http.ResponseWriter, err error) {
	code := http.StatusBadGateway
	switch status.Code(err) {
	case codes.InvalidArgument:
		code = http.StatusBadRequest
	case codes.AlreadyExists:
		code = http.StatusConflict
	case codes.Unauthenticated:
		code = http.StatusUnauthorized
	case codes.DeadlineExceeded:
		code = http.StatusGatewayTimeout
	}
	http.Error(w, http.StatusText(code), code)
}
