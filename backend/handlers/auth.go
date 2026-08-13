package handlers

import (
	"encoding/json"
	"net/http"
	"strings"

	"gitscope.com/backend/db"
	"gitscope.com/backend/utils"
	"golang.org/x/crypto/bcrypt"
)

type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func decodeCredentials(w http.ResponseWriter, r *http.Request) (Credentials, bool) {
	r.Body = http.MaxBytesReader(w, r.Body, 16<<10)
	var creds Credentials
	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()
	if err := dec.Decode(&creds); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return creds, false
	}
	creds.Username = strings.TrimSpace(creds.Username)
	if len(creds.Username) < 3 || len(creds.Username) > 64 || len(creds.Password) < 8 || len(creds.Password) > 128 {
		http.Error(w, "Username must be 3-64 characters and password 8-128 characters", http.StatusBadRequest)
		return creds, false
	}
	return creds, true
}

func Signup(w http.ResponseWriter, r *http.Request) {
	creds, ok := decodeCredentials(w, r)
	if !ok {
		return
	}
	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(creds.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Error hashing password", http.StatusInternalServerError)
		return
	}

	// Insert into database
	result, err := db.Pool.Exec(r.Context(), "INSERT INTO users (username, password) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING", creds.Username, string(hashedPassword))
	if err != nil {
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		return
	}
	if result.RowsAffected() == 0 {
		http.Error(w, "Username already taken", http.StatusConflict)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Write([]byte("Signup successful!"))
}

func Login(w http.ResponseWriter, r *http.Request) {
	creds, ok := decodeCredentials(w, r)
	if !ok {
		return
	}

	var storedPassword string
	var userID int
	err := db.Pool.QueryRow(r.Context(), "SELECT password, id FROM users WHERE username=$1", creds.Username).Scan(&storedPassword, &userID)
	if err != nil {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(storedPassword), []byte(creds.Password))
	if err != nil {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	tokenString, err := utils.GenerateJWT(creds.Username, userID)
	if err != nil {
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"token": tokenString})
}
