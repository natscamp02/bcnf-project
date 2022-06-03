const express = require('express');
const bcrypt = require('bcrypt');
const conn = require('../db');

const router = express.Router();

router.get('/signup', (req, res) => {
	res.render('admin/signup');
});

router.post('/signup', async (req, res) => {
	const data = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		password: req.body.password,
	};

	if (req.body.confirm !== req.body.password) {
		console.log('Passwords do not match');
		return res.redirect('/admin/signup');
	}

	data.password = await bcrypt.hash(data.password, 12);

	conn.query(
		`INSERT INTO admins (${Object.keys(data).join(',')}) VALUES (?, ?, ?, ?)`,
		Object.values(data),
		async (err, result) => {
			try {
				if (err) throw err;

				req.session.isLoggedIn = true;
				req.session.firstName = req.body.first_name;

				res.redirect('/dashboard');
			} catch (error) {
				console.log(error);
				res.redirect('/admin/signup');
			}
		}
	);
});

router.get('/login', (req, res) => {
	res.render('admin/login');
});

router.post('/login', async (req, res) => {
	const data = {
		email: req.body.email,
		password: req.body.password,
	};

	conn.query('SELECT * FROM admins WHERE email = ?', [data.email], async (err, admins) => {
		try {
			if (err) throw err;

			if (admins.length <= 0) throw new Error('Incorrect email address');
			if (!(await bcrypt.compare(data.password, admins[0].password))) throw new Error('Incorrect password');

			req.session.isLoggedIn = true;
			req.session.firstName = admins[0].first_name;

			res.redirect('/dashboard');
		} catch (error) {
			console.log(error);
			return res.redirect('/admin/login');
		}
	});
});

router.get('/logout', (req, res, next) => {
	req.session.destroy();
	res.redirect('/');
});

module.exports = router;
