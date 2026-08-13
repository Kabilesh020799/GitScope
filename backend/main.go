package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"gitscope.com/backend/db"
	"gitscope.com/backend/handlers"
	"gitscope.com/backend/middleware"
	"gitscope.com/backend/utils"
)

func cors(allowed map[string]bool) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			origin := r.Header.Get("Origin")
			if origin != "" && !allowed[origin] {
				http.Error(w, "Origin not allowed", http.StatusForbidden)
				return
			}
			if origin != "" {
				w.Header().Set("Access-Control-Allow-Origin", origin)
				w.Header().Set("Vary", "Origin")
				w.Header().Set("Access-Control-Allow-Credentials", "true")
			}
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusNoContent)
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}

func main() {
	if os.Getenv("RENDER") == "" {
		if err := godotenv.Load(); err != nil {
			log.Println("No .env file found; using process environment")
		}
	}
	if err := utils.ConfigureJWT(os.Getenv("JWT_SECRET")); err != nil {
		log.Fatal(err)
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	connectCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
	if err := db.Connect(connectCtx); err != nil {
		cancel()
		log.Fatal(err)
	}
	cancel()
	defer db.Pool.Close()

	r := mux.NewRouter()
	r.Use(cors(parseOrigins(os.Getenv("ALLOWED_ORIGINS"))))
	r.HandleFunc("/healthz", func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"status":"ok"}`))
	}).Methods(http.MethodGet)
	r.HandleFunc("/login", handlers.Login).Methods(http.MethodPost, http.MethodOptions)
	r.HandleFunc("/signup", handlers.Signup).Methods(http.MethodPost, http.MethodOptions)
	protected := r.PathPrefix("/api").Subrouter()
	protected.Use(middleware.JWTAuthentication)
	protected.HandleFunc("/profile", handlers.Profile).Methods(http.MethodGet)
	protected.HandleFunc("/repos", handlers.AddRepository).Methods(http.MethodPost)
	protected.HandleFunc("/repos", handlers.GetRepositories).Methods(http.MethodGet)
	protected.HandleFunc("/github/{owner}/{repo}/{path:.*}", handlers.GitHubProxy).Methods(http.MethodGet)

	addr := os.Getenv("ADDR")
	if addr == "" {
		addr = ":10000"
	}
	srv := &http.Server{Addr: addr, Handler: r, ReadHeaderTimeout: 5 * time.Second, ReadTimeout: 15 * time.Second, WriteTimeout: 30 * time.Second, IdleTimeout: 60 * time.Second}
	go func() {
		log.Printf("Server starting on %s", addr)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("server: %v", err)
		}
	}()
	<-ctx.Done()
	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer shutdownCancel()
	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Printf("graceful shutdown: %v", err)
	}
}

func parseOrigins(value string) map[string]bool {
	if strings.TrimSpace(value) == "" {
		value = "http://localhost:3000"
	}
	result := make(map[string]bool)
	for _, origin := range strings.Split(value, ",") {
		if origin = strings.TrimSpace(origin); origin != "" {
			result[origin] = true
		}
	}
	return result
}
