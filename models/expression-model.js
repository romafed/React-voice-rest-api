const mongoose = require('mongoose');

const expressionScheme = mongoose.Schema({
    questions: {
        type: [ String ],
        maxlength: 300,
        required: true,
    },
    answers: {
        type: [ String ],
        maxlength: 300,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Expressions = mongoose.model('expression', expressionScheme);

module.exports = {
    Expressions
}