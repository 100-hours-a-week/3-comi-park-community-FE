FROM node:23-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

EXPOSE 3000

CMD ["npm", "start"]