# Backend Docker Image Overview

This folder contains the production multi-stage Docker image definition for the backend API.

## Image purpose

- Builds the TypeScript backend into a minimal runtime image.
- Installs only production dependencies in the final image.
- Runs the API on port `4000`.

## Build stages

1. `deps`

- Base: `node:25-alpine`
- Installs full dependencies from `package.json` and `yarn.lock`.

2. `build`

- Reuses dependency layer.
- Copies source code and runs `yarn build` to create `dist/`.

3. `prod-deps`

- Installs production-only dependencies with `yarn install --production=true`.

4. `runtime`

- Base: `node:25-alpine`
- Copies production `node_modules` from `prod-deps`.
- Copies compiled output from `build`.
- Creates `/app/storage/uploads` and runs as non-root `node` user.

## Build command

Run from repository root:

```bash
docker build \
  -f etc/docker/backend/Dockerfile \
  -t jsc-flip-market-be:local \
  src/backend
```

## Runtime defaults

- Exposed container port: `4000`
- Start command: `node dist/server.js`

## Compose usage

- Development compose (`etc/docker/docker-compose.yml`) does not build this image.
  It runs `node:25-alpine` with source mounted from `src/backend`.
- Production compose (`etc/docker/docker-compose.prod.yml`) builds this image using:
  - context: `src/backend`
  - dockerfile: `etc/docker/backend/Dockerfile`
