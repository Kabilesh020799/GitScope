package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"gitscope.com/backend/db"
	"gitscope.com/backend/handlers"
	"gitscope.com/backend/middleware"
)

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/login", handlers.Login).Methods("POST")
	r.HandleFunc("/signup", handlers.Signup).Methods("POST")

	// Protected routes
	protected := r.PathPrefix("/api").Subrouter()
	protected.Use(middleware.JWTAuthentication)
	protected.HandleFunc("/profile", handlers.Profile).Methods("GET")

	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	
	// Connect to DB
	err = db.Connect()
	if err != nil {
		log.Fatal(err)
	}


	log.Println("Server starting on :8080")
	err = http.ListenAndServe(":8080", r)
	if err != nil {
		log.Fatal(err)
	}
}
