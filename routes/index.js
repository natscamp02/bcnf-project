const express = require('express');
const conn = require('../db');
const protect = require('../utils/protect');

const router = express.Router();

router.use(protect);

router.get('/', (req, res, next) => {
	res.redirect('/dashboard');
});

router.get('/dashboard', (req, res, next) => {
	// Getting number of employees
	conn.query('SELECT COUNT(id) as num_of_employees from employees', (err, [count]) => {
		if (err || !count) {
			console.log(err);
			return res.render('error/generic');
		}

		// Getting average number of supervisors per department
		conn.query(
			'SELECT AVG(calc.num_of_sup) as average FROM (SELECT department, COUNT(id) AS num_of_sup FROM amberproject1.supervisors GROUP BY department) calc;',
			(err, [avg]) => {
				if (err || !avg) {
					console.log(err);
					return res.render('error/generic');
				}

				// Getting the most popular department based on num of employees
				conn.query(
					`SELECT MAX(aggr.emp_count) AS count, aggr.department 
                     FROM (SELECT COUNT(emps.id) as emp_count, spvs.department
                        FROM employees emps, employee_supervisor em_sp, supervisors spvs
                        WHERE em_sp.emp_id = emps.id AND em_sp.sup_id = spvs.id GROUP BY spvs.department) aggr;
                    `,
					(err, [max]) => {
						if (err || !max) {
							console.log(err);
							return res.render('error/generic');
						}

						res.render('dashboard', {
							num_of_employees: count.num_of_employees,
							avg_num_of_sup: avg.average,
							popular_dprt: max.department,
						});
					}
				);
			}
		);
	});
});

module.exports = router;
