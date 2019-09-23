const { transports } = require('winston');

module.exports = function(logger) {

    logger.exceptions.handle(
        new transports.File({ filename: 'log/exceptions.log' })
    );

    process.on('unhandledRejection', (err) => {
        throw new Error(err);
    });

}