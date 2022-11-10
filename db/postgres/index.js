const { Pool } = require('pg');
require('dotenv').config();

// Uncomment this and comment pool below in deployed one.
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// pool for local dev environment.
// const pool = new Pool({
//   user: 'keewooklee',
//   password: '',
//   port: 5432,
//   host: 'localhost',
//   database: 'reviewsdc',
// });

pool.on('connect', (client) => {
  console.log(`connected to DB(postgres) on port ${client.port}`);
});

pool.on('error', (err, client) => {
  console.error(`Error on DB on port ${client.port}`, err);
  process.exit(-1);
});

module.exports = pool;
