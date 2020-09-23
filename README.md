# MyWonderbird web

This is the back-end REST service for MyWonderbird. 
It also serves the landing page and administration panel front-ends.

## Pre-requisites
To be able to run the back-end service you need:
- Node.js at least version 12.13 (could work with an earlier version though). The easiest approach is to use node version manager (`nvm`) if you have multiple node versions
- A postgres instance - can be running as a service (https://www.postgresql.org/download/) or on docker (https://hub.docker.com/_/postgres). If going the docker route, you might want to install pgAdmin separately to be able to use a GUI to browse the database

## Running the application
Before running the application:
- Install the dependencies - `npm install`
- Run database migrations - `npm run migrate`. This should be run whenever new migrations get added as well.

To run the application with auto-reload, run:
- `start:server:dev`
- `debug:server:dev` - additionally enables debuggers to attach to the server for easier debugging
To run the application without auto-reload, run:
- `start:server`

In case you need to run the admin panel as well, run:
- `start:web:dev` - starts a development server with hot-reload for the front-end
- `build:web` - builds the front-end code. Run this before starting the server so it can serve the files

## Third-party services used
There are a few third-party services used that need credentials for the application to run properly:

### AWS S3
Required for storing files (would be better if we didn't store files on AWS when running locally)

Environment variables:
- AWS_ACCESS_KEY
- AWS_SECRET_KEY
- AWS_S3_BUCKET_NAME

### AWS Cognito
Required for authentication

Environment variables:
- AWS_COGNITO_REGION
- AWS_COGNITO_POOL_ID
- AWS_COGNITO_CLIENT_ID
- AWS_COGNITO_DOMAIN

### Mailerlite
Required for tracking subscribers and sending emails (not done from the application at the moment)

- MAILERLITE_API_KEY
- MAILERLITE_WEB_GROUP_ID
- MAILERLITE_NEWSLETTER_GROUP_ID

### Segment (to be deprecated?)
Required for tracking user events

Environment variables:
- SEGMENT_WRITE_KEY

### HERE Maps
Used for geolocation

Environment variables:
- HERE_MAPS_APP_ID
- HERE_MAPS_API_KEY

### Sentry
Used for error reporting - not required when NODE_ENV=development

Environment variables:
- SENTRY_DSN

## Other
### Prettier
Prettier is used for formatting code so discussions about style are kept to a minimum

You can install extensions for it on your IDE - https://prettier.io/docs/en/editors.html

