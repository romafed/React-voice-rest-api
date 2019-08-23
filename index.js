const debug = require('debug')('app:development');
const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');
const app = express();

// Imported routers
const expressions = require('./routers/expressions');

// Configuration
console.log(`Application name: ${config.get('name')}`);
console.log(`Application password: ${config.get('password')}`);

// Middleware
app.use(express.json());
app.use(helmet());

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    debug('Morgan enabled...');
}

// Routers
app.get('/', (req, res) => {
    res.send('Api started');
});
app.use('/api/expressions', expressions);

// listening server
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port: ${port}...`));
