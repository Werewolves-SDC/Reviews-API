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

const queries = {
  createSchema: () => {
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

    pg.query(`CREATE TABLE IF NOT EXISTS photos (
      id SERIAL PRIMARY KEY,
      url VARCHAR,
      review_id int
    );`, (err, res) => {
      console.log(err ? err.stack : res.rows);
    });

    pg.query(`CREATE TABLE IF NOT EXISTS characteristics (
      id SERIAL PRIMARY KEY,
      product_id int,
      name VARCHAR
    );`, (err, res) => {
      console.log(err ? err.stack : res.rows);
    });

    pg.query(`CREATE TABLE IF NOT EXISTS characteristics_reviews (
      id SERIAL PRIMARY KEY,
      review_id int,
      characteristics_id int,
      value int
    );`, (err, res) => {
      console.log(err ? err.stack : res.rows);
    });
  },
};

module.exports = queries;
