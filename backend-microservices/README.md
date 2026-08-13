# Backend microservices (experimental)

This directory is an incomplete migration from the monolithic `backend/`. It currently supports only signup and login. Repository storage, profiles, JWT verification, and the authenticated GitHub proxy remain available only in the monolith; do not route production traffic here until those features are implemented.

Internal gRPC ports are private to the Docker/Kubernetes network. Transport credentials currently use plaintext within that trusted network; production clusters should add workload identity and mTLS through a service mesh or explicit gRPC TLS certificates.

Required secrets are `DATABASE_URL` and a randomly generated `JWT_SECRET` of at least 32 characters. Kubernetes deployments expect them in `neon-db-secret` and `gitscope-secrets` respectively.
