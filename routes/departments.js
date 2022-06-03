const express = require('express');
const conn = require('../db');
const protect = require('../utils/protect');

const router = express.Router();

router.use(protect);

router.get('/', (req, res) => {
	conn.query('SELECT department FROM supervisors', (err, departments) => {
		if (err) {
			console.log(err);
			return res.redirect('/');
		}

		res.render('departments/list', {
			departments,
		});
	});
});

module.exports = router;
