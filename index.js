require('express-async-errors');
const logger = require('./winston/winston')
const express = require('express');
const app = express();

require('./startup/logging')(logger);                 // Error
require('./startup/routers')(app);                    // Start routers
require('./startup/db')(logger);                      // Start DB
require('./startup/configuration')(app, logger);      // Development configuration
require('./startup/prod')(app);                       // Prod

// listening server
const port = process.env.PORT || 3001;
app.listen(port, () => logger.info(`Listening on port: ${port}...`));