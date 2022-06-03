const mysql = require('mysql2');

const conn = mysql.createConnection({
	host: 'localhost',

	user: 'root',
	password: process.env.DB_PASSWORD,

	database: 'amberproject1',
});

module.exports = conn;
