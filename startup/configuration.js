const config = require('config');

module.exports = function() {

    if (!config.get('jwtKey')) {
        throw new  Error('ERROR: jwtKey is not define');
    }
}