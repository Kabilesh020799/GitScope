package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"gitscope.com/backend/db"
	"gitscope.com/backend/middleware"
	"gitscope.com/backend/utils"
)

type Repository struct {
	ID	int	`json:"id"`
	UserID	int	`json:"user_id"`
	Name	string	`json:"name"`
	URL	string	`json:"url"`
	CreatedAt	time.Time	`json:"created_at"`
}

func AddRepository(w http.ResponseWriter, r *http.Request) {
	var repo Repository
	err := json.NewDecoder(r.Body).Decode(&repo)
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	// Get user info from context
	claims, ok := r.Context().Value(middleware.UserCtxKey).(*utils.Claims)
	if !ok {
		http.Error(w, "Could not retrieve user from context", http.StatusUnauthorized)
		return
	}

	repo.UserID = claims.UserID

	err = db.Conn.QueryRow(
		context.Background(),
		"INSERT INTO repositories (user_id, name, url) VALUES ($1, $2, $3) RETURNING id, created_at", repo.UserID, repo.Name, repo.URL,
	).Scan(&repo.ID, &repo.CreatedAt)

	if err != nil {
    http.Error(w, "Failed to insert repo", http.StatusInternalServerError)
    return
	}

	json.NewEncoder(w).Encode(repo)
}

func GetRepositories(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.UserCtxKey).(*utils.Claims)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	rows, err := db.Conn.Query(
		context.Background(),
		"SELECT id, user_id, name, url, created_at FROM repositories WHERE user_id = $1 ORDER BY created_at DESC",
		claims.UserID,
	)

	if err != nil {
		http.Error(w, "Failed to fetch repositories", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var repos []Repository
	for rows.Next() {
		var repo Repository
		err := rows.Scan(&repo.ID, &repo.UserID, &repo.Name, &repo.URL, &repo.CreatedAt)

		if err != nil {
			http.Error(w, "Error reading repository", http.StatusInternalServerError)
			return
		}
		repos = append(repos, repo)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(repos)
}