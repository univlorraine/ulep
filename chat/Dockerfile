#syntax=docker/dockerfile:1.4

FROM node:18-alpine as chat_base

# install openssl - resolves the issue with the prisma client
# RUN apk update && apk upgrade
# RUN apk add --no-cache openssl

# https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
RUN apk add --no-cache libc6-compat

WORKDIR /srv/app

RUN corepack enable && \
	corepack prepare --activate pnpm@latest && \
	pnpm config -g set store-dir /.pnpm-store

# Deps stage, preserve dependencies in cache as long as the lockfile isn't changed
FROM chat_base AS chat_deps

COPY --link pnpm-lock.yaml ./
RUN pnpm fetch

COPY --link . .
RUN pnpm install --offline --frozen-lockfile
RUN pnpm prisma generate

# Development image
FROM chat_deps as chat_dev

EXPOSE 3003
ENV PORT 3003

EXPOSE 5000
ENV WEBSOCKET_PORT 5000

CMD ["sh", "-c", "pnpm start:dev"]

# Build stage
FROM chat_deps AS chat_builder

COPY --link . .
COPY --from=chat_deps --link /srv/app/node_modules ./node_modules

RUN pnpm run build

# Production image, copy all the files and run nest
FROM chat_builder AS chat_prod

WORKDIR /srv/app

ENV NODE_ENV production

RUN addgroup -S -g 1001 nodejs
RUN adduser -S -u 1001 nestjs

USER nestjs

EXPOSE 3003
ENV PORT 3003

EXPOSE 5000
ENV WEBSOCKET_PORT 5000

CMD ["pnpm", "run", "start:prod"]
