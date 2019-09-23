const express = require('express');
const expressions = require('../routers/expressions');
const users = require('../routers/users');
const auth = require('../routers/auth');
const errors = require('../middleware/errors');

module.exports = function(app) {
    app.use(express.json());
    app.get('/', (req, res) => res.send('Api started'));
    app.use('/api/expressions', expressions);
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use(errors);
};