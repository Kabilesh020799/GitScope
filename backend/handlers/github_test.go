package handlers

import "testing"

func TestValidGitHubPath(t *testing.T) {
	for _, path := range []string{"commits", "pulls/12/reviews", "contributors"} {
		if !validGitHubPath(path) {
			t.Errorf("valid path rejected: %s", path)
		}
	}
	for _, path := range []string{"", "/commits", "../users", "issues//comments", "issues?x"} {
		if validGitHubPath(path) {
			t.Errorf("invalid path accepted: %s", path)
		}
	}
}
