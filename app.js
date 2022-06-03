const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const baseRouter = require('./routes');
const adminRouter = require('./routes/admin');
const employeesRouter = require('./routes/employees');
const supervisorsRouter = require('./routes/supervisors');
const departmentsRouter = require('./routes/departments');

const app = express();

// Setting up templates
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Body and cookie parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Server session
app.use(
	session({
		secret: process.env.SESSION_SECRET,

		saveUninitialized: false,
		resave: false,

		cookie: {
			maxAge: 5 * 60 * 60 * 1000,
			secure: process.env.NODE_ENV === 'production',
		},
	})
);

// Routes
app.use('/admin', adminRouter);
app.use('/employees', employeesRouter);
app.use('/supervisors', supervisorsRouter);
app.use('/departments', departmentsRouter);
app.use('/', baseRouter);

// Not Found handler
app.all('*', (req, res) => res.render('error/not-found'));

module.exports = app;
