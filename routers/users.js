const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const { Users, userValidate } = require('../models/user-model');
const express = require('express');
const router = express.Router();



router.get('/me', auth, async (req, res) => {
    const user = await Users.findById(req.body.user._id).select('-password -isAdmin');
    if (!user) return res.status(404).send('Cant find user');

    res.send(user);
});



router.post('/', async (req, res) => {

    // Check validation of user request
    const { error } = userValidate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { name, surname, email, password, isAdmin } = req.body;

    // Check if email exist
    const isSame = await Users.findOne({ email });
    if (isSame) return res.status(400).send('User already registered');

    // Create new user and save
    const user = new Users({
        name,
        surname,
        email,
        password
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.send({name, email, isAdmin, date: user.date});
});



module.exports = router;
    