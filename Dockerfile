FROM node:12.13.0-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install && \
  npm run build:web && \ 
  rm -rf ./src/web && \
  npm prune --production


CMD ["npm", "run", "start:server"] 