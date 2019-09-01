const mongoose = require('mongoose');
const debug = require('debug')('app:development');
const listenDebug = require('debug')('app:listen');
const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');
const app = express();
// Imported routers
const expressions = require('./routers/expressions');

// Start DB
mongoose.connect('mongodb://localhost/expressions-data',  { useNewUrlParser: true })
.then(() => listenDebug('MongoDb is connected...'));

// Configuration
debug(`Application name: ${config.get('name')}`);

// Middleware
app.use(express.json());
app.use(helmet());

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    debug('Morgan enabled...');
}

// Routers
app.get('/', (req, res) => res.send('Api started'));
app.use('/api/expressions', expressions);

// listening server
const port = process.env.PORT || 3001;
app.listen(port, () => listenDebug(`Listening on port: ${port}...`));
