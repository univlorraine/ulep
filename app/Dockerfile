FROM node:18-alpine
WORKDIR /app
COPY package*.json /app/
RUN npm install -g @ionic/cli
RUN npm i -g pnpm@9.12.1
RUN pnpm install --prefer-offline --frozen-lockfile
COPY ./ /app/
