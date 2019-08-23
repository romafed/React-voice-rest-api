
const Joi = require('joi');
const express = require('express');
const router = express.Router();

const arrayCompare = require('../utils/array-compare');
const expressions = require('../expressionsData');

router.get('/', (req, res) => {
    if (!expressions) return res.status(404).send('Cant find expressions');
    res.send(expressions);
});

router.post('/', (req, res) => {
    const { error } = validateExpression(req.body, true);
    if (error) return res.status(400).send(error.details[0].message);

    const sameExpression = expressions.find(exp => {
        const sameQuestions = arrayCompare(exp.questions, req.body.questions);
        return sameQuestions;
    });
    if (sameExpression) return res.status(400).send('The expressions with same questions exist');

    const { questions, answers } = req.body;
    const expression = {
        id: expressions.length + 1,
        questions,
        answers
    };
    expressions.push(expression);
    res.send(expression);
});

router.get('/:id', (req, res) => {
    const expression = expressions.find(exp => exp.id === +req.params.id);
    if (!expression) return res.status(404).send('Cant find expression with given ID');
    res.send(expression);
})

router.put('/:id', (req, res) => {
    const { error } = validateExpression(req.body, false);
    if (error) return res.status(400).send(error.details[0].message);

    const expression = expressions.find(exp => exp.id === +req.params.id);
    if (!expression) return res.status(404).send('Cant find expression with given ID');

    const { questions, answers } = req.body;
    expression.questions = questions || expression.questions;
    expression.answers = answers || expression.answers;

    res.send(expression);
});

router.delete('/:id', (req, res) => {
    const expression = expressions.find(exp => exp.id === parseInt(req.params.id));
    if (!expression) return res.status(404).send('Cant find expression with given ID');

    const index = expressions.indexOf(expression);
    expressions.splice(index, 1);
    res.send(expression);
});

function validateExpression(expression, isRequired = true) {
    const schema = {
        questions:
            isRequired ? Joi.array().items(Joi.string()).required() :
                Joi.array().items(Joi.string()),
        answers:
            isRequired ? Joi.array().items(Joi.string()).required() :
                Joi.array().items(Joi.string())
    }
    return Joi.validate(expression, schema);
}

module.exports = router;
