# Build the static site with Node, then serve dist/ from nginx on port 80.

FROM node:22-alpine AS build
WORKDIR /app

# Install dependencies first, so this layer stays cached until the lockfile changes.
# --ignore-scripts: none of the site's dependencies need install scripts. Running them
# in this build left the base image without /bin/busybox in the sandbox used to test it.
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build

# The BetterNotez web app, served from /app/ on the same domain.
FROM node:22-alpine AS webapp
RUN apk add --no-cache git
ARG APP_REF=main
RUN git clone --depth 1 --branch "$APP_REF" https://github.com/Timmyy3000/BetterNotez.git /src
WORKDIR /src
RUN npm ci --ignore-scripts
RUN BETTERNOTEZ_BASE_PATH=/app/ npm run build -w @betternotez/app

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=webapp /src/apps/app/dist /usr/share/nginx/html/app
EXPOSE 80
