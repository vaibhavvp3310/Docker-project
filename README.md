# LinkStash — Containerized Bookmark Manager

A full-stack bookmark manager application containerized with Docker, orchestrated with Docker Compose, and hardened following container security best practices.

## Architecture

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Frontend   │─────▶│   Backend    │─────▶│   MongoDB    │
│  React SPA   │      │ Express API  │      │  Database    │
│  Port 3000   │      │  Port 5000   │      │  Port 27017  │
└──────────────┘      └──────────────┘      └──────────────┘
   (published)          (internal)            (internal)

Only the frontend port is published to the host.
Backend and MongoDB communicate over an internal Docker network.
```

- **Frontend:** React single-page app — create, search, tag, and delete bookmarks
- **Backend:** Node.js / Express REST API with input validation and health check endpoint
- **Database:** MongoDB with named volume for data persistence

## Containerization

Both the frontend and backend use **multi-stage Docker builds**:

- **Stage 1** — full `node` image to install dependencies (`npm install`)
- **Stage 2** — lightweight `node:lts-alpine` for production, copying only `node_modules` from stage 1

This reduces final image size significantly by excluding build tools and npm cache from the production image. Each service runs as a **non-root user** created inside the container.

## Security Hardening

| Measure                       | What it does                                                                                  |
| ----------------------------- | --------------------------------------------------------------------------------------------- |
| `read_only: true`             | Filesystem is read-only — prevents attackers from writing malicious files if they gain access |
| `tmpfs` mounts                | Targeted writable mounts only where needed (`/tmp`, node cache)                               |
| `cap_drop: ALL`               | Drops all Linux capabilities — containers run with zero kernel-level privileges               |
| `no-new-privileges`           | Prevents processes from gaining additional privileges through setuid/setgid binaries          |
| `mem_limit: 256m`             | Caps memory per container — prevents a single service from consuming all host resources       |
| Non-root users                | Each container runs as a dedicated unprivileged user, not root                                |
| Health checks                 | Docker monitors each service and marks it unhealthy if it stops responding                    |
| `depends_on: service_healthy` | Services start only after their dependencies are confirmed healthy                            |
| Internal networking           | Backend and database ports are not published — only reachable within the Docker network       |

## How to Run

### Prerequisites

- Docker and Docker Compose installed

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/YOUR_USERNAME/linkstash.git
   cd linkstash
   ```

2. Create environment files from the examples:

   ```bash
   cp env/backend.env.example env/backend.env
   cp env/mongo.env.example env/mongo.env
   ```

3. Edit `env/backend.env` and `env/mongo.env` with your credentials. Make sure the username and password match across both files.

4. Start the application:

   ```bash
   docker compose up -d
   ```

5. Open `http://localhost:3000` in your browser.

### Useful Commands

```bash
# Check container status and health
docker compose ps

# View logs
docker compose logs -f

# Stop everything
docker compose down

# Stop and remove the database volume (full reset)
docker compose down -v
```

## Planned Improvements

- Nginx reverse proxy for serving the frontend and routing API requests
- GitHub Actions CI/CD pipeline for automated image builds
- Docker image scanning for vulnerability detection

## Tech Stack

- **Frontend:** React 18
- **Backend:** Node.js, Express, Mongoose, express-validator
- **Database:** MongoDB
- **Containerization:** Docker, Docker Compose
