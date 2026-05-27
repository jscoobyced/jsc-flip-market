# Frontend Docker Image Overview

This folder contains the production multi-stage Docker image definition for the frontend app.

## Image purpose

- Builds the React + Vite frontend into static assets.
- Serves built assets with `nginx:alpine`.
- Uses custom Nginx config from `etc/docker/frontend/nginx.conf`.

## Build stages

1. `build`

- Base: `node:25-alpine`
- Copies frontend `package.json` and `yarn.lock` from `src/frontend/`.
- Installs dependencies and runs `yarn build`.
- Produces static files in `/app/dist`.

2. `runtime`

- Base: `nginx:1.30-alpine`
- Copies `nginx.conf` to `/etc/nginx/conf.d/default.conf`.
- Copies static files to `/usr/share/nginx/html`.
- Starts Nginx in foreground.

## Build command

Run from repository root:

```bash
docker build \
  -f etc/docker/frontend/Dockerfile \
  -t jsc-flip-market-fe:local \
  .
```

Important: this Dockerfile expects repository-root build context (`.`), because it copies from `src/frontend/` and `etc/docker/frontend/`.

## Runtime defaults

- Exposed container port: `80`
- Start command: `nginx -g 'daemon off;'`

## Compose usage

- Development compose (`etc/docker/docker-compose.yml`) does not build this image.
  It runs `node:25-alpine` with `src/frontend` mounted for live development.
- Production compose (`etc/docker/docker-compose.prod.yml`) builds this image using:
  - context: repository root
  - dockerfile: `etc/docker/frontend/Dockerfile`
