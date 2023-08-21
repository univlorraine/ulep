FROM node:18-alpine as build
WORKDIR /app
COPY package*.json /app/
RUN npm install -g ionic
RUN npm i -g pnpm@8.6.9
RUN pnpm install
COPY ./ /app/
RUN pnpm run build

FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist/ /usr/share/nginx/html/