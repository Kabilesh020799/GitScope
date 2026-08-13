package handlers

import (
	"io"
	"net/http"
	"net/url"
	"os"
	"regexp"
	"strings"
	"time"

	"github.com/gorilla/mux"
)

var githubSegment = regexp.MustCompile(`^[A-Za-z0-9_.-]+$`)
var githubClient = &http.Client{Timeout: 25 * time.Second}

// GitHubProxy keeps the GitHub credential server-side and only permits paths
// below the requested repository. Authentication is provided by the /api router.
func GitHubProxy(w http.ResponseWriter, r *http.Request) {
	token := strings.TrimSpace(os.Getenv("GITHUB_TOKEN"))
	if token == "" {
		http.Error(w, "GitHub integration is not configured", http.StatusServiceUnavailable)
		return
	}
	v := mux.Vars(r)
	owner, repo, rest := v["owner"], v["repo"], v["path"]
	if !githubSegment.MatchString(owner) || !githubSegment.MatchString(repo) || !validGitHubPath(rest) {
		http.Error(w, "Invalid GitHub path", http.StatusBadRequest)
		return
	}
	target := &url.URL{Scheme: "https", Host: "api.github.com", Path: "/repos/" + owner + "/" + repo + "/" + rest, RawQuery: r.URL.RawQuery}
	req, err := http.NewRequestWithContext(r.Context(), http.MethodGet, target.String(), nil)
	if err != nil {
		http.Error(w, "Invalid upstream request", http.StatusBadRequest)
		return
	}
	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("X-GitHub-Api-Version", "2022-11-28")
	resp, err := githubClient.Do(req)
	if err != nil {
		http.Error(w, "GitHub request failed", http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()
	for _, name := range []string{"Content-Type", "Link", "ETag", "Last-Modified", "X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset", "X-RateLimit-Used", "X-RateLimit-Resource"} {
		if value := resp.Header.Get(name); value != "" {
			w.Header().Set(name, value)
		}
	}
	w.WriteHeader(resp.StatusCode)
	_, _ = io.Copy(w, io.LimitReader(resp.Body, 20<<20))
}

func validGitHubPath(path string) bool {
	if path == "" || strings.HasPrefix(path, "/") {
		return false
	}
	for _, part := range strings.Split(path, "/") {
		if part == "" || part == "." || part == ".." || !githubSegment.MatchString(part) {
			return false
		}
	}
	return true
}
