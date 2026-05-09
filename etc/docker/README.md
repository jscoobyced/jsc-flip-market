# Docker stack

This folder contains a compose setup for:

- backend API
- frontend app
- PostgreSQL database

## Layout

- backend Dockerfile: `etc/docker/backend/Dockerfile`
- frontend Dockerfile: `etc/docker/frontend/Dockerfile`
- compose file: `etc/docker/docker-compose.yml`
- production compose file: `etc/docker/docker-compose.prod.yml`
- postgres data directory: `etc/docker/db/`

## Start the stack with your user UID/GID

From the repository root:

```bash
docker compose --env-file etc/docker/.env.local -f etc/docker/docker-compose.yml up --build
```

This keeps bind-mounted files in `etc/docker/db/` owned by your current user account.

## Development setup (volume-mounted)

The development compose file uses volume mounts instead of image builds:

- `src/backend` and `src/frontend` are mounted as-is into containers
- `node_modules` runs in separate container-managed volumes
- Changes to source code are immediately visible in the running containers
- Container runs `yarn install && yarn dev` on startup
- Source files are not overwritten by the container (read-write volumes + separate node_modules isolation)

Note: If you modify `package.json` or `yarn.lock`, restart the containers:

```bash
docker compose --env-file etc/docker/.env.local -f etc/docker/docker-compose.yml down
docker compose --env-file etc/docker/.env.local -f etc/docker/docker-compose.yml up
```

Use `etc/docker/.env.local` for development settings and `etc/docker/.env.prod` for production settings.

## Start production images (multi-stage builds)

From the repository root:

```bash
docker compose --env-file etc/docker/.env.prod -f etc/docker/docker-compose.prod.yml up --build
```

## Stop and remove containers

```bash
docker compose --env-file etc/docker/.env.local -f etc/docker/docker-compose.yml down
```
