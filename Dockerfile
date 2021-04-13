FROM node:12.13.0-alpine

WORKDIR /usr/src/app

COPY . .

RUN apk add python make gcc g++
RUN echo "$FIREBASE_API_KEY"
RUN npm install && \
  npm run build:web && \
  rm -rf ./src/web && \
  npm prune --production


CMD ["npm", "run", "start:server"]
