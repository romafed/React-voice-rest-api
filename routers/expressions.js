const { Users } = require('../models/user-model');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

// Data from DB
const { Expressions, validateExpression } = require('../models/expression-model');

// Utils
const arrCompare = require('../utils/array-compare');


// Routers
router.get('/', async (req, res) => {
    const expressions = await Expressions.find();
    if (!expressions) return res.status(404).send('Cant find expressions');
    res.send(expressions);
});



router.post('/', auth, async (req, res) => {
    // Check request validation
    const { error } = validateExpression(req.body, true);
    if (error) return res.status(400).send(error.details[0].message);

    const { questions, answers, user } = req.body;
    
    // Check for same questions in DB
    const questionsDb = await Expressions.find({}, '-_id').select('questions');
    const isSame = arrCompare(questions, questionsDb, 'questions');
    if (!isSame) return res.status(400).send('The question is already exist');

    // Create new expression and save it in DB
    const expression = new Expressions({
        questions,
        answers,
        user: {
            _id: user._id,
            name: user.name,
            surname: user.surname
        }
    });

    const result = await expression.save();
    res.send(result);
});



router.get('/:id', async (req, res) => {
    const expression = await Expressions.findById(req.params.id);
    if (!expression) return res.status(404).send('Cant find expression with given ID');
    res.send(expression);
})



router.put('/:id', auth, async (req, res) => {
    // Check for validation in request
    const { error } = validateExpression(req.body, false);
    if (error) return res.status(400).send(error.details[0].message);

    const { questions, answers, user } = req.body;
    // Check for expression
    const expression = await Expressions.findById(req.params.id);
    if (!expression) return res.status(404).send('Cant find expression with given ID');

    // Check for same questions
    if (questions) {
        const isSame = arrCompare(questions, expression.questions);
        if (!isSame) return res.status(400).send('The question is already exist');
    }

    // Set changes and save
    expression.set({
        questions: questions ? [...expression.questions, ...questions] : expression.questions,
        answers: answers ? [...expression.answers, ...answers] : expression.answers
    });
    
    const result = await expression.save(expression);
    res.send(result);
});



router.delete('/:id', auth, async (req, res) => {
    try {
        const expression = await Expressions.findByIdAndDelete(req.params.id);
        res.send(expression)
    } catch(ex) {
        res.status(404).send('Cant find expression with given ID');
    }
});

module.exports = router;
