const mongoose = require('mongoose');
const config = require('config');

module.exports = function(logger) {
    const options = {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true
    }
    mongoose.connect(config.get('db'),  options)
    .then(() => {logger.info('MongoDb is connected...')});
}