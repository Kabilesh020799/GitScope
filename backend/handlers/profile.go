package handlers

import (
	"encoding/json"
	"net/http"
	"strings"

	"gitscope.com/backend/utils"
)

type ProfileResponse struct {
	Message string `json:"message"`
}

func Profile(w http.ResponseWriter, r *http.Request) {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		http.Error(w, "Missing Authorization Header", http.StatusUnauthorized)
		return
	}

	tokenParts := strings.Split(authHeader, " ")
	if len(tokenParts) != 2 || strings.ToLower(tokenParts[0]) != "bearer" {
		http.Error(w, "Invalid Authorization header format", http.StatusUnauthorized)
		return
	}

	tokenString := tokenParts[1]

	claims, err := utils.VerifyJWT(tokenString)
	if err != nil {
		http.Error(w, "Invalid Token", http.StatusUnauthorized)
		return
	}

	response := ProfileResponse {
		Message: "Hello, " + claims.Username + "!",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}