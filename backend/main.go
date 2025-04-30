package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"gitscope.com/backend/db"
	"gitscope.com/backend/handlers"
	"gitscope.com/backend/middleware"
)

func main() {
	r := mux.NewRouter()
	r.Use(middleware.CORSMiddleware)

	r.HandleFunc("/login", handlers.Login).Methods("POST")
	r.HandleFunc("/signup", handlers.Signup).Methods("POST")

	// Protected routes
	protected := r.PathPrefix("/api").Subrouter()
	protected.Use(middleware.JWTAuthentication)
	protected.HandleFunc("/profile", handlers.Profile).Methods("GET")
	protected.HandleFunc("/repositories", handlers.AddRepository).Methods("POST")
	protected.HandleFunc("/repos", handlers.GetRepositories).Methods("GET")

	// Load environment variables
	if os.Getenv("RENDER") == "" {
		err := godotenv.Load()
		if err != nil {
			log.Println("No .env file found, using system environment variables")
		}
	}
	
	// Connect to DB
	err := db.Connect()
	if err != nil {
		log.Fatal(err)
	}


	log.Println("Server starting on :10000")
	err = http.ListenAndServe(":10000", r)
	if err != nil {
		log.Fatal(err)
	}
}
