package handlers

import (
	"encoding/json"
	"gitscope.com/backend/middleware"
	"gitscope.com/backend/utils"
	"net/http"
)

type ProfileResponse struct {
	Message string `json:"message"`
}

func Profile(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.UserCtxKey).(*utils.Claims)
	if !ok {
		http.Error(w, "Invalid Token", http.StatusUnauthorized)
		return
	}

	response := ProfileResponse{
		Message: "Hello, " + claims.Username + "!",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
