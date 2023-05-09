#syntax=docker/dockerfile:1.4

FROM node:18-alpine as builder_base

# https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
RUN apk add --no-cache libc6-compat

WORKDIR /srv/app

RUN corepack enable && \
	corepack prepare --activate pnpm@latest && \
	pnpm config -g set store-dir /.pnpm-store

# Deps stage, preserve dependencies in cache as long as the lockfile isn't changed
FROM builder_base AS deps

COPY --link pnpm-lock.yaml ./
RUN pnpm fetch

COPY --link . .
RUN pnpm install -r --offline

# Development image
FROM deps as dev

EXPOSE 3000
ENV PORT 3000

CMD ["sh", "-c", "pnpm install -r --offline; pnpm start:dev"]

FROM builder_base AS builder

COPY --link . .
COPY --from=deps --link /srv/app/node_modules ./node_modules

RUN pnpm run build

# Production image, copy all the files and run nest
FROM node:18-alpine AS prod

WORKDIR /srv/app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=builder --link /srv/app/dist ./dist

USER nestjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "dist/main"]
