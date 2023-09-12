#syntax=docker/dockerfile:1.4

FROM node:18-alpine as api_base

# https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
RUN apk add --no-cache libc6-compat

WORKDIR /srv/app

RUN corepack enable && \
	corepack prepare --activate pnpm@latest && \
	pnpm config -g set store-dir /.pnpm-store

# Deps stage, preserve dependencies in cache as long as the lockfile isn't changed
FROM api_base AS api_deps

COPY --link pnpm-lock.yaml ./
RUN pnpm fetch

COPY --link . .
RUN pnpm install --offline --frozen-lockfile
RUN pnpm prisma generate

# Development image
FROM api_deps as api_dev

EXPOSE 3000
ENV PORT 3000

CMD ["sh", "-c", "pnpm start:dev"]

# Build stage
FROM api_deps AS api_builder

COPY --link . .
COPY --from=api_deps --link /srv/app/node_modules ./node_modules

RUN pnpm run build

# Production image, copy all the files and run nest
FROM api_builder AS api_prod

WORKDIR /srv/app

ENV NODE_ENV production

RUN addgroup -S -g 1001 nodejs
RUN adduser -S -u 1001 nestjs

USER nestjs

EXPOSE 3000

ENV PORT 3000

CMD ["pnpm", "run", "start:prod"]

# Production image, copy all the files and run nest
FROM api_deps AS api_init

RUN apk add --no-cache postgresql

CMD ["sh", "-c", "set -x; while [ $(pg_isready -d $DB_NAME -h $HOST_NAME -p 5432 -U $DB_USER -q; echo $?) -ne 0 ]; do sleep 5; done; pnpx prisma migrate deploy; if [ $(psql -tA -d $DB_NAME -h $HOST_NAME -p 5432 -U $DB_USER -c \"SELECT COUNT(*) FROM language_codes;\") -ne 0 ]; then echo \"No need to seed\"; else pnpm seed; fi"]