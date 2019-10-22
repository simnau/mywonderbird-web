const path = require('path');
const express = require('express');
const serveStatic = require('serve-static');
const bodyParser = require('body-parser');

const api = require('./apiRouter');
const errorHandler = require('../middleware/error-handler');

const app = express();
const { PORT = 8080 } = process.env;

const DIST_PATH = path.resolve('dist');

app.use(bodyParser.json());

app.use('/', serveStatic(DIST_PATH));
app.use('/api', api);
app.use('/*', serveStatic(DIST_PATH));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
