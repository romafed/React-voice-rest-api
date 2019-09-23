const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 15,
        required: true 
    },
    surname: {
        type: String,
        minlength: 2,
        maxlength: 15,
        required: true 
    },
    password: {
        type: String,
        min: 5,
        max: 1025,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

userSchema.method('generateJwtToken', function() {
    const token = jwt.sign({
        _id: this._id,
        name: this.name,
        surname: this.surname
    }, config.get('jwtKey'));
    return token
});

const Users = mongoose.model('User', userSchema);

function userValidate(items) {
    const scheme = {
        name: Joi.string().max(30).required(),
        surname: Joi.string().max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(5).max(16).required(),
        isAdmin: Joi.boolean()
    }

    return Joi.validate(items, scheme);
}

module.exports = {
    Users,
    userValidate
}