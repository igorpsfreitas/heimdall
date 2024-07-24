FROM node:20

RUN mkdir -p /frontend
WORKDIR /frontend

COPY package*.json ./
RUN npm install
RUN chown -R node:node /frontend/node_modules