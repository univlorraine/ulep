#syntax=docker/dockerfile:1.4

# Base node image with pnpm enabled
FROM node:18-alpine as admin_base

RUN apk add --no-cache libc6-compat

WORKDIR /srv/app

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
COPY --link . .
COPY --from=admin_deps --link /srv/app/node_modules ./node_modules

RUN pnpm run build

# Production stage
FROM node:18-alpine AS admin_prod

WORKDIR /srv/app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs \
	adduser --system --uid 1001 react

COPY --from=admin_builder --link --chown=react:nodejs /srv/app/build ./build

CMD ["node", "/build"]