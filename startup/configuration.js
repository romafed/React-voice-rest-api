const config = require('config');
const morgan = require('morgan');

module.exports = function(app, logger) {

    if (!config.get('jwtKey')) {
        throw new  Error('ERROR: jwtKey is not define');
    }

    if (process.env.NODE_ENV === 'development' || 'undefined') {
        app.use(morgan('tiny'));
        logger.info('Morgan enabled...');
    }
}