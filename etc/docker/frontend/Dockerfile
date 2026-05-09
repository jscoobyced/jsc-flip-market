FROM node:25-alpine AS build
WORKDIR /app

COPY src/frontend/package.json src/frontend/yarn.lock ./
RUN yarn install --frozen-lockfile

COPY src/frontend/ .
RUN yarn build

FROM nginx:1.30-alpine AS runtime
COPY etc/docker/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
