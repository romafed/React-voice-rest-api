const mongoose = require('mongoose');

module.exports = function(logger) {
    const options = {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true
    }
    mongoose.connect('mongodb://localhost/expressions-data',  options)
    .then(() => {logger.info('MongoDb is connected...')});
}