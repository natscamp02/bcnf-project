require('dotenv').config({ path: './config.env' });
const conn = require('./db');
const app = require('./app');
const PORT = process.env.PORT || 8080;

conn.connect((err) => (err ? console.error(err) : console.log('Connected to database...')));
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
