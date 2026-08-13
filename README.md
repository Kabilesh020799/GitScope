# GitScope

GitScope is a React dashboard for exploring GitHub repository activity. It combines GitHub commit, contributor, pull-request, comment, and review data with authenticated, user-specific saved repositories stored by a Go API in PostgreSQL.

## Supported architecture

The production path is the root React application plus the monolithic API in `backend/`:

```text
Browser (React 18) ──► Go HTTP API ──► PostgreSQL
       │
       └─────────────► GitHub API proxy in the Go API
```

The backend owns credentials and GitHub API access. The browser sends the GitScope JWT to the backend and must not contain a GitHub token.

`backend-microservices/` is an experimental migration containing HTTP, auth gRPC, database gRPC, Compose, and Kubernetes examples. It is not feature-complete and is not the production path. `microfrontends/` is archived proof-of-concept code; see [microfrontends/README.md](microfrontends/README.md). Keeping these experiments explicitly out of the default build prevents them from being mistaken for deployable alternatives.

## Requirements

- Docker with Docker Compose is sufficient for the complete local stack.
- For development without containers: Node.js 20, npm, Go 1.23.8, and PostgreSQL 14 or newer.
- A GitHub token is needed for repository analytics.

## Start the complete application with Docker

The default Compose stack runs the supported React frontend, Go API, and PostgreSQL database. Database migrations are applied automatically when the database volume is first created.

Optionally copy the example configuration and add a fine-grained GitHub token:

```sh
cp .env.example .env
# Edit .env and set GITHUB_TOKEN. Also replace the local password and JWT secret.
```

Then start everything:

```sh
docker compose up --build
```

Open `http://localhost:8080`. Only the frontend port is exposed; Nginx serves the SPA and proxies authentication and API traffic to the private backend service. PostgreSQL is private to the Compose network and persists in the `postgres_data` volume.

Useful lifecycle commands:

```sh
docker compose up --build -d  # start in the background
docker compose logs -f        # follow all service logs
docker compose down           # stop containers and retain database data
docker compose down -v        # stop and delete the local database volume
```

`APP_PORT` can change the host port. `POSTGRES_PASSWORD`, `JWT_SECRET`, and `GITHUB_TOKEN` can be supplied through `.env` or the invoking environment. The committed defaults are for local development only; replace them anywhere shared or deployed.

## Configuration

Create `backend/.env` for local development. Never commit it.

```dotenv
DATABASE_URL=postgres://gitscope:password@localhost:5432/gitscope?sslmode=disable
JWT_SECRET=replace-with-at-least-32-random-bytes
GITHUB_TOKEN=github-token-used-only-by-the-backend
ALLOWED_ORIGINS=http://localhost:3000
ADDR=:10000
```

Create a root `.env.local` containing only public browser configuration:

```dotenv
REACT_APP_API_URL=http://localhost:10000
```

Do not define `REACT_APP_GITHUB_TOKEN`: Create React App embeds every `REACT_APP_*` value in its public bundle.

## Database

Apply the versioned SQL files in `backend/migrations/` in filename order before starting the API. They define users, saved repositories, uniqueness constraints, ownership relations, and indexes. Back up production data before applying a new migration and run migrations as a deployment step, not from each application replica.

For a local database:

```sh
createdb gitscope
psql gitscope -f backend/migrations/001_init.sql
```

## Development

Install and start the frontend:

```sh
npm ci
npm start
```

In another terminal, start the supported backend:

```sh
cd backend
go run .
```

The frontend runs at `http://localhost:3000`; the API defaults to `http://localhost:10000`.

## Validation

```sh
npm run lint        # root React source
npm test            # root tests only, non-interactive
npm run build       # production frontend bundle
npm run validate:go # test and vet every Go module
npm run validate    # all of the above
```

GitHub Actions runs the same frontend and Go checks for pull requests and pushes to `main`. Add tests with every bug fix, especially around authorization, repository ownership, GitHub pagination/rate limits, stale requests, and chart rendering of untrusted values.

## Deployment

Build the frontend with `npm run build` and serve `build/` from a static host. Deploy the supported Go API behind TLS with secrets supplied by the platform. Run at least two API replicas only after confirming shared state is in PostgreSQL, configure health probes and request timeouts, and restrict CORS to the deployed frontend origin.

The experimental Kubernetes resources under `backend-microservices/k8s/` require pinned image tags, externally managed secrets, TLS, probes, resource requests/limits, and an authenticated or network-isolated gRPC boundary before production use.

## Repository layout

- `src/`: supported React application, Redux state, hooks, and visualizations
- `backend/`: supported Go HTTP API and database migrations
- `backend-microservices/`: experimental service decomposition
- `microfrontends/`: archived Module Federation/CRA experiments
- `.github/workflows/ci.yml`: continuous validation

## Security notes

- Keep GitHub and JWT secrets server-side and rotate any previously browser-exposed token.
- Treat repository names, usernames, commit messages, and comments as untrusted input; render them as text, never HTML.
- Use a unique, high-entropy JWT secret and reject startup when required configuration is absent.
- Do not log connection strings, tokens, password hashes, or authorization headers.
- Keep dependencies and base images patched and review GitHub/API rate-limit behavior before enabling large repositories.
