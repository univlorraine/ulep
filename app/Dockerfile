FROM node:18-alpine as build
WORKDIR /app
COPY package*.json /app/
RUN npm install -g ionic
RUN npm i -g pnpm@8.6.9
RUN pnpm install
COPY ./ /app/
RUN pnpm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist/ /usr/share/nginx/html/