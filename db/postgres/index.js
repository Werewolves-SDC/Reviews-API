const { Pool } = require('pg');

const pg = new Pool({
  user: 'keewooklee',
  password: '',
  port: 5432,
  host: 'localhost',
  database: 'reviewsdc',
});

pg.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('connected to DB(postgres)');
  }
});

pg.query(`CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  product_id int,
  rating int,
  summary VARCHAR,
  recommend boolean,
  response VARCHAR,
  body VARCHAR,
  date timestamp,
  reviewer_name VARCHAR,
  helpfulness int
);`, (err, res) => {
  console.log(err ? err.stack : res.rows);
});

module.exports = pg;
