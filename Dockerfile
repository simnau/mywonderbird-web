FROM node:12.13.0-alpine

ENV FIREBASE_API_KEY=AIzaSyAo8aNIhx60Fr8m3kri8leBPKIsaS4LIgc
ENV FIREBASE_AUTH_DOMAIN=mywonderbird-256205.firebaseapp.com
ENV FIREBASE_PROJECT_ID=mywonderbird-256205
ENV FIREBASE_APP_ID=1:874546630664:web:1a7951298db89cbc95c1bd

WORKDIR /usr/src/app

COPY . .

RUN apk add python make gcc g++
RUN echo "$FIREBASE_API_KEY"
RUN npm install && \
  npm run build:web && \
  rm -rf ./src/web && \
  npm prune --production


CMD ["npm", "run", "start:server"]
