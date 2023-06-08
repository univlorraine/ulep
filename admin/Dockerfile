# Base image for all steps
FROM node:18-alpine as admin-node-dev

WORKDIR /srv/admin/

COPY package.json .
COPY pnpm-lock.lock .

RUN pnmp install --frozen-lockfile

COPY . .

RUN pnpm build

# Expose port 3001
EXPOSE 3001
