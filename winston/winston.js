const winston = require('winston');
require('winston-mongodb');

const options = {
    transports: [
        new winston.transports.Console({
            format: winston.format.simple()
        }),
        new winston.transports.MongoDB({
            db: 'mongodb://localhost/expressions-data',
            level: 'error'
        }),
        new winston.transports.File({
            filename: 'log/info.log',
            level: 'info'
        }),
        new winston.transports.File({
            filename: 'log/combined.log'
        }),
    ]
}

const logger = winston.createLogger(options);

module.exports = logger;