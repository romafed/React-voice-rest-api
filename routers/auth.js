const { Users } = require('../models/user-model');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const express = require('express');
const router = express.Router();


router.post('/', async (req, res) => {
    const { email, password } = req.body;

    const { error } = validateAuth(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await Users.findOne({ email: email });
    if (!user) return res.status(404).send('Invalid email or password');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(404).send('Invalid email or password');

    const token = user.generateJwtToken();

    res.send(token);
});

function validateAuth(req) {
    const scheme = {
        email: Joi.string().email().required(),
        password: Joi.string().min(5).max(20).required()
    }

    return Joi.validate(req, scheme);
};


module.exports = router;