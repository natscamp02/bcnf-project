const express = require('express');
const conn = require('../db');
const protect = require('../utils/protect');
const groupFields = require('../utils/groupFields');

const router = express.Router();

// Ensure user is logged in
router.use(protect);

//! Account for employees in multiple departments
// Get and show all employees
router.get('/', (req, res, next) => {
	let queryString = `
        SELECT emps.*, spvs.first_name AS s_f_name, spvs.last_name AS s_l_name, spvs.department
        FROM employees emps, employee_supervisor em_sp, supervisors spvs
        WHERE em_sp.emp_id = emps.id AND em_sp.sup_id = spvs.id
    `;

	if (req.query.search) {
		let [first_name, last_name] = req.query.search.split(' ');

		if (first_name) queryString += ` AND emps.first_name LIKE '%${first_name}%'`;
		if (last_name) queryString += ` AND emps.last_name LIKE '%${last_name}%'`;
	}

	queryString += ' ORDER BY emps.id';

	conn.query(queryString, (err, employees) => {
		if (err) {
			console.log(err);
			return res.redirect('/');
		}

		res.render('employees/list', {
			employees,
		});
	});
});

// Show employee add form
router.get('/add', (req, res, next) => {
	conn.query('SELECT * FROM supervisors', (err, data) => {
		if (err) {
			console.log(err);
			return res.redirect('/employees');
		}

		res.render('employees/add', {
			supervisors: data,
		});
	});
});

// Add employees
router.post('/add', (req, res, next) => {
	const data = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email_address: req.body.email_address,
		salary: req.body.salary,
		supervisor_id: req.body.supervisor,
	};

	let sqlString = 'INSERT INTO employees (first_name, last_name, email_address, salary) VALUES (';
	sqlString += "'" + data.first_name + "', ";
	sqlString += "'" + data.last_name + "', ";
	sqlString += "'" + data.email_address + "', ";
	sqlString += '' + data.salary + ')';

	conn.query(sqlString, (err, result) => {
		if (err) {
			console.log(err);
			return res.redirect('/employees/add');
		}

		const employeeId = result.insertId;

		conn.query(
			`INSERT INTO employee_supervisor (emp_id, sup_id) VALUES (${employeeId}, ${data.supervisor_id})`,
			(err, result) => {
				if (err) {
					console.log(err);
					return res.redirect('/employees/add');
				}

				res.redirect('/employees');
			}
		);
	});
});

//! Account for employees in multiple departments
// Show employee edit form
router.get('/:id/edit', (req, res, next) => {
	conn.query(
		'SELECT emps.*, e_s.sup_id FROM employees emps, employee_supervisor e_s WHERE e_s.emp_id = emps.id AND emps.id = ' +
			req.params.id,
		(err, employees) => {
			if (err || !employees.length) {
				console.log(err);
				return res.redirect('/employees');
			}

			const employee = groupFields(employees);

			conn.query('SELECT * FROM supervisors', (err, supervisors) => {
				if (err) {
					console.log(err);
					return res.redirect('/employees');
				}

				res.render('employees/edit', {
					supervisors,
					employee,
				});
			});
		}
	);
});

// Update employee info
router.post('/update', (req, res, next) => {
	const data = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email_address: req.body.email_address,
		salary: req.body.salary,
	};

	let sqlString = 'UPDATE employees SET ';
	sqlString += "first_name = '" + data.first_name + "', ";
	sqlString += "last_name = '" + data.last_name + "', ";
	sqlString += "email_address = '" + data.email_address + "', ";
	sqlString += 'salary = ' + data.salary + ' ';
	sqlString += 'WHERE id = ' + req.body.employee_id;

	conn.query(sqlString, (err, results) => {
		if (err) console.log(err);

		res.redirect('/employees');
	});
});

// Delete employee info
router.get('/:id/delete', (req, res, next) => {
	conn.query('DELETE FROM employees WHERE id = ' + req.params.id, (err, result) => {
		if (err) console.log(err);

		res.redirect('/employees');
	});
});

module.exports = router;
