FROM node:16.14.2-alpine

WORKDIR /usr/src/app

COPY . .

RUN apk add --no-cache python3 py3-pip make g++

RUN npm install

RUN npm run build
