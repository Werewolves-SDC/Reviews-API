const { Pool } = require('pg');
require('dotenv').config();

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
      date bigint,
      summary VARCHAR,
      body VARCHAR,
      recommend BOOLEAN,
      reported BOOLEAN,
      reviewer_name VARCHAR,
      reviewer_email VARCHAR,
      response VARCHAR,
      helpfulness int
    );`, (err, res) => {
      console.log(err ? err.stack : res.rows);
    });

    pg.query(`CREATE TABLE IF NOT EXISTS reviews_photos (
      id SERIAL PRIMARY KEY,
      review_id int,
      url VARCHAR
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
      characteristic_id int,
      review_id int,
      value int
    );`, (err, res) => {
      console.log(err ? err.stack : res.rows);
    });
  },

  dropTables: () => {
    pg.query(`
      DROP TABLE reviews;
    `, (err, res) => {
      console.log(err ? err.stack : res);
    });

    pg.query(`
      DROP TABLE reviews_photos;
    `, (err, res) => {
      console.log(err ? err.stack : res);
    });

    pg.query(`
      DROP TABLE characteristics;
    `, (err, res) => {
      console.log(err ? err.stack : res);
    });

    pg.query(`
      DROP TABLE characteristics_reviews;
    `, (err, res) => {
      console.log(err ? err.stack : res);
    });
  },

  getCharacteristics: () => {
    pg.query(`
      SELECT * FROM characteristics;
    `, (err, res) => {
      console.log(err ? err.stack : res.rows);
    });
  },
};

queries.createSchema();

module.exports = queries;
