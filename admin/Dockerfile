# Base image for all steps
FROM node:18-alpine as admin-node-staging

WORKDIR /srv/admin/

COPY package.json .
COPY package.lock .

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

# Expose port 3001
EXPOSE 3001
