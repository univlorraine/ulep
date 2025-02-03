#syntax=docker/dockerfile:1.4

# Base node image with pnpm enabled
FROM node:18-alpine3.20 as admin_base

RUN apk add --no-cache libc6-compat

WORKDIR /srv/app

ENV COREPACK_DEFAULT_TO_LATEST=0
RUN corepack enable && \
	corepack prepare --activate pnpm@latest && \
	pnpm config -g set store-dir /.pnpm-store

# Deps stage
FROM admin_base AS admin_deps

COPY --link pnpm-lock.yaml ./
RUN pnpm fetch

COPY --link . .
RUN pnpm install --offline --frozen-lockfile

# Development image
FROM admin_deps as admin_dev

EXPOSE 3000
ENV PORT 3000

CMD ["pnpm", "start"]

# Build stage
FROM admin_base AS admin_builder
WORKDIR /srv/app

COPY --link . .
COPY --from=admin_deps --link /srv/app/node_modules ./node_modules

RUN pnpm run build

FROM admin_builder AS admin_prod

ENV NODE_ENV production

RUN addgroup -S -g 1001 nodejs
RUN adduser -S -u 1001 nestjs
RUN npm i -g serve

EXPOSE 80

ENV PORT 80

CMD ["bash", "-c", "serve -s build -l 80"]