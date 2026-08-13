#!/bin/sh
set -eu

# Keep compiler output in a writable, disposable location in CI and sandboxes.
GOCACHE="${TMPDIR:-/tmp}/gitscope-go-build"
export GOCACHE
mkdir -p "$GOCACHE"

find backend backend-microservices -name go.mod -type f | sort | while IFS= read -r module; do
  directory=$(dirname "$module")
  echo "Validating $directory"
  (
    cd "$directory"
    packages=$(go list ./...)
    if [ -z "$packages" ]; then
      echo "Skipping $directory (module contains no packages)"
      exit 0
    fi
    go test ./...
    go vet ./...
  )
done
