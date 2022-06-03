const express = require('express');
const conn = require('../db');
const protect = require('../utils/protect');

const router = express.Router();

router.use(protect);

// Show all supervisors
router.get('/', (req, res) => {
	conn.query('SELECT spvs.* FROM supervisors spvs', (err, supervisors) => {
		if (err) {
			console.log(err);
			return res.redirect('/');
		}

		res.render('supervisors/list', {
			supervisors,
		});
	});
});

// Show add supervisor form
router.get('/add', (req, res) => {
	res.render('supervisors/add');
});

// Add a new supervisor
router.post('/add', (req, res) => {
	const data = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		department: req.body.department,
	};

	conn.query(
		`INSERT INTO supervisors (${Object.keys(data).join(', ')}) VALUES (?,?,?)`,
		Object.values(data),
		(err, result) => {
			if (err) {
				console.log(err);
				return res.redirect('/supervisors/add');
			}

			res.redirect('/supervisors');
		}
	);
});

// Show edit form
router.get('/:id/edit', (req, res) => {
	conn.query('SELECT * FROM supervisors WHERE id = ' + req.params.id, (err, data) => {
		if (err) {
			console.log(err);
			return res.redirect('/supervisors');
		}

		res.render('supervisors/edit', {
			supervisor: data[0],
		});
	});
});

// Update supervisor's info
router.post('/update', (req, res) => {
	const data = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		department: req.body.department,
	};

	conn.query(`UPDATE supervisors SET ? WHERE id = ` + req.body.supervisor_id, data, (err, result) => {
		if (err) console.log(err);

		res.redirect('/supervisors');
	});
});

// Delete a supervisor
router.get('/:id/delete', (req, res) => {
	conn.query('DELETE FROM supervisors WHERE id = ' + req.params.id, (err, result) => {
		if (err) console.log(err);

		res.redirect('/supervisors');
	});
});

module.exports = router;
