const express = require('express');
const conn = require('../db');
const protect = require('../utils/protect');

const router = express.Router();

router.use(protect);

router.get('/', (req, res, next) => {
	res.redirect('/dashboard');
});

router.get('/dashboard', (req, res, next) => {
	res.render('dashboard');
});

module.exports = router;
