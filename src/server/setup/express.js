const path = require('path');
const express = require('express');
const serveStatic = require('serve-static');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const config = require('config');

const api = require('./apiRouter');
const errorHandler = require('../middleware/error-handler');
const checkAuth = require('../middleware/check-auth');

const app = express();
const port = config.get('server.port');
const maxUploadSize = config.get('media.fileUpload.maxSize');

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

app.use('/', serveStatic(DIST_PATH));
app.use('/api', api);
app.use('/*', serveStatic(DIST_PATH));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
