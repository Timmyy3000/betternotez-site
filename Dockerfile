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

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
