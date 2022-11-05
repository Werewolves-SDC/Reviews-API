const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: 'keewooklee',
  password: '',
  port: 5432,
  host: 'localhost',
  database: 'reviewsdc',
});

pool.on('connect', (client) => {
  console.log(`connected to DB(postgres) on port ${client.port}`);
});

pool.on('error', (err, client) => {
  console.error(`Error on DB on port ${client.port}`, err);
  process.exit(-1);
});

module.exports = pool;
