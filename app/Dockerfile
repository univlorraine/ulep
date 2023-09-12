FROM node:18-alpine
WORKDIR /app
COPY package*.json /app/
RUN npm install -g @ionic/cli
RUN npm i -g pnpm@8.6.9
RUN pnpm install
COPY ./ /app/