const path = require('path');
const express = require('express');
const serveStatic = require('serve-static');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const config = require('config');

const api = require('./apiRouter');
const errorHandler = require('../middleware/error-handler');
const checkAuth = require('../middleware/check-auth');
const logger = require('../util/logger');

const app = express();
const port = config.get('server.port');
const maxUploadSize = config.get('media.fileUpload.maxSize');

const LANDING_PAGE_PATH = path.resolve('src', 'landing-page');
const DIST_PATH = path.resolve('dist');

app.use(bodyParser.json());
app.use(
  fileUpload({
    limits: {
      fileSize: maxUploadSize,
    },
    abortOnLimit: true,
  }),
);
app.use(checkAuth);

app.use('/', serveStatic(LANDING_PAGE_PATH));
app.use('/admin', serveStatic(DIST_PATH));
app.use('/api', api);
app.use('/admin/*', serveStatic(DIST_PATH));
app.use('/*', serveStatic(LANDING_PAGE_PATH));

app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});
