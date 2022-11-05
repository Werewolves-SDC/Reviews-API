/* eslint-disable arrow-body-style */
const pool = require('../index');

module.exports = {
  createSchema: () => {
    pool.query(`CREATE TABLE IF NOT EXISTS reviews (
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

    pool.query(`CREATE TABLE IF NOT EXISTS reviews_photos (
      id SERIAL PRIMARY KEY,
      review_id int,
      url VARCHAR
    );`, (err, res) => {
      console.log(err ? err.stack : res.rows);
    });

    pool.query(`CREATE TABLE IF NOT EXISTS characteristics (
      id SERIAL PRIMARY KEY,
      product_id int,
      name VARCHAR
    );`, (err, res) => {
      console.log(err ? err.stack : res.rows);
    });

    pool.query(`CREATE TABLE IF NOT EXISTS characteristics_reviews (
      id SERIAL PRIMARY KEY,
      characteristic_id int,
      review_id int,
      value int
    );`, (err, res) => {
      console.log(err ? err.stack : res.rows);
    });
  },

  dropTables: () => {
    pool.query(`
      DROP TABLE reviews;
    `, (err, res) => {
      console.log(err ? err.stack : res);
    });

    pool.query(`
      DROP TABLE reviews_photos;
    `, (err, res) => {
      console.log(err ? err.stack : res);
    });

    pool.query(`
      DROP TABLE characteristics;
    `, (err, res) => {
      console.log(err ? err.stack : res);
    });

    pool.query(`
      DROP TABLE characteristics_reviews;
    `, (err, res) => {
      console.log(err ? err.stack : res);
    });
  },
  getReviewPG: (productId, page, count, sort) => {
    // console.log(page);
    // console.log(count);
    // console.log(sort);
    // console.log(productId);
    let sortBy = 'date desc';
    if (sort === 'helpful') {
      sortBy = 'helpful desc';
    }
    if (sort === 'relevent') {
      sortBy = 'date desc';
    }

    // TODO: implement pagination and limit by using page and count
    const query = {
      text: `
      SELECT id as review_id, rating, summary, recommend, response, body, to_timestamp(date/1000) as date, reviewer_name, helpfulness
      FROM reviews
      WHERE product_id=$1 and reported=false
      ORDER BY ${sortBy}
      ;`,
      values: [productId],
    };
    return pool.connect()
      .then((client) => {
        return client.query(query)
          .then((res) => {
            client.release();
            return res.rows;
          })
          .catch((err) => {
            client.release();
            return err.stack;
          });
      });
  },

  getReviewMetaPG: async (productId) => {
    const client = await pool.connect();
    const queryForReview = {
      text: `SELECT id, rating, recommend
        FROM reviews
        WHERE product_id=$1
        ;`,
      values: [productId],
    };

    // const queryForCharacteristics = {
    //   text: `SELECT id, name
    //     FROM characteristics
    //     WHERE product_id=$1
    //     ;`,
    //   values: [productId],
    // };

    const reviewRes = await pool.query(queryForReview);
    console.log(reviewRes.rows);

    // TODO: get characteristics and then merge.
    client.release();
  },

  addHelpful: (reviewId) => {
    const query = {
      text: `UPDATE reviews
        SET helpfulness = helpfulness + 1
        WHERE id=$1
        ;`,
      values: [reviewId],
    };

    return pool.connect()
      .then((client) => {
        return client.query(query)
          .then((res) => {
            pool.release();
            return res.rows;
          }).catch((err) => {
            pool.release();
            return err.stack;
          });
      });
  },

  addReport: (reviewId) => {
    const query = {
      text: `UPDATE reviews
      SET reported = true
      WHERE id=$1
      ;`,
      values: [reviewId],
    };

    return pool.connect()
      .then((client) => {
        return client.query(query)
          .then((res) => {
            pool.release();
            return res.rows;
          }).catch((err) => {
            pool.release();
            return err.stack;
          });
      });
  },

  getCharacteristics: () => {
    pool.query(`
      SELECT * FROM characteristics;
    `, (err, res) => {
      console.log(err ? err.stack : res.rows);
    });
  },
};
