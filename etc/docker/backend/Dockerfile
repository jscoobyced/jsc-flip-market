FROM node:25-alpine AS deps
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM deps AS build
COPY . .
RUN yarn build

FROM node:25-alpine AS prod-deps
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=true

FROM node:25-alpine AS runtime
ARG UID=1000
ARG GID=1000

RUN addgroup -S -g ${GID} appgroup \
    && adduser -S -D -u ${UID} -G appgroup appuser

WORKDIR /app

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

RUN mkdir -p /app/storage/uploads \
    && chown -R appuser:appgroup /app

USER appuser

EXPOSE 4000

CMD ["node", "dist/server.js"]
