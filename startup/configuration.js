const config = require('config');
const morgan = require('morgan');

module.exports = function(app, logger) {

    if (!config.get('jwtKey')) {
        throw new  Error('ERROR: jwtKey is not define');
    }
}