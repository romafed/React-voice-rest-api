
const Joi = require('joi');
const express = require('express');
const router = express.Router();

// Data from DB
const { Expressions } = require('../models/expression-model');

// Utils
const arrCompare = require('../utils/array-compare');

router.get('/', async (req, res) => {
    const expressions = await Expressions.find();
    if (!expressions) return res.status(404).send('Cant find expressions');
    res.send(expressions);
});



router.post('/', async (req, res) => {
    // Check request validation
    const { error } = validateExpression(req.body, true);
    if (error) return res.status(400).send(error.details[0].message);

    const { questions, answers } = req.body;
    
    // Check for same questions in DB
    const questionsDb = await Expressions.find({}, '-_id').select('questions');
    const isSame = arrCompare(questions, questionsDb, 'questions');
    if (!isSame) return res.status(400).send('The question is already exist');

    // Create new expression and save it in DB
    const expression = new Expressions({
        questions,
        answers
    });

    const result = await expression.save();
    res.send(result);
});



router.get('/:id', async (req, res) => {
    const expression = await Expressions.findById(req.params.id);
    if (!expression) return res.status(404).send('Cant find expression with given ID');
    res.send(expression);
})



router.put('/:id', async (req, res) => {
    // Check for validation in request
    const { error } = validateExpression(req.body, false);
    if (error) return res.status(400).send(error.details[0].message);

    const { questions, answers } = req.body;
    // Check for expression
    const expression = await Expressions.findById(req.params.id);
    if (!expression) return res.status(404).send('Cant find expression with given ID');

    // Check for same questions
    if (questions) {
        const isSame = arrCompare(questions, expression.questions);
        if (!isSame) return res.status(400).send('The question is already exist');
    }

    expression.set({
        questions: questions ? [...expression.questions, ...questions] : expression.questions,
        answers: answers ? [...expression.answers, ...answers] : expression.answers
    });
    
    const result = await expression.save(expression);
    res.send(result);
});



router.delete('/:id', async (req, res) => {
    try {
        const expression = await Expressions.findByIdAndDelete(req.params.id);
        res.send(expression)
    } catch(ex) {
        res.status(404).send('Cant find expression with given ID');
    }
});

function validateExpression(expression, isRequired = true) {
    const schema = {
        questions:
            isRequired ? Joi.array().items(Joi.string().lowercase().required()) :
                Joi.array().items(Joi.string().lowercase()),
        answers:
            isRequired ? Joi.array().items(Joi.string().lowercase()).required() :
                Joi.array().items(Joi.string().lowercase())
    }
    return Joi.validate(expression, schema);
}

module.exports = router;
