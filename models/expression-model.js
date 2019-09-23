const Joi = require('joi');
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
    },
    user: mongoose.Schema({
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        surname: {
            type: String,
            required: true
        }
    })
});

const Expressions = mongoose.model('expression', expressionScheme);

function validateExpression(expression, isRequired = true) {
    const schema = {
        questions:
            isRequired ? Joi.array().items(Joi.string().lowercase().required()) :
                Joi.array().items(Joi.string().lowercase()),
        answers:
            isRequired ? Joi.array().items(Joi.string().lowercase()).required() :
                Joi.array().items(Joi.string().lowercase()),
        user: Joi.object()
    }
    return Joi.validate(expression, schema);
}

module.exports = {
    Expressions,
    validateExpression
}