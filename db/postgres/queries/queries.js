/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable quotes */
/* eslint-disable camelcase */
/* eslint-disable arrow-body-style */
const format = require('pg-format');
const pool = require('../index');

module.exports = {
  createIndex: () => {
    pool.query(`CREATE INDEX idx_productid_characteristics ON characteristics(product_id);`, (err, res) => {
      console.log(err ? err.stack : res);
    });

    pool.query(`CREATE INDEX idx_characteristicid_charrev ON characteristics_reviews(characteristic_id);`, (err, res) => {
      console.log(err ? err.stack : res);
    });

    pool.query(`CREATE INDEX idx_reviewid_charrev ON characteristics_reviews(review_id);`, (err, res) => {
      console.log(err ? err.stack : res);
    });

    pool.query(`CREATE INDEX idx_productid_review ON reviews(product_id);`, (err, res) => {
      console.log(err ? err.stack : res);
    });

    pool.query(`CREATE INDEX idx_reviewid_revphoto ON reviews_photos(review_id);`, (err, res) => {
      console.log(err ? err.stack : res);
    });

    pool.release();
  },

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
    let sortBy = 'date desc';
    if (sort === 'helpful') {
      sortBy = 'helpful desc';
    }
    if (sort === 'relevent') {
      sortBy = 'date desc';
    }
    const offset = (page - 1) * count;

    const query = {
      text: `
      SELECT id as review_id, rating, summary, recommend, response, body, to_timestamp(date/1000) as date, reviewer_name, helpfulness,
      ( SELECT coalesce(json_agg(to_json(photo)), '[]')
        FROM (
          SELECT reviews_photos.id, reviews_photos.url
          FROM reviews_photos
          WHERE reviews_photos.review_id = reviews.id
        ) photo
      ) AS photos
      FROM reviews
      WHERE product_id=$1 and reported=false
      ORDER BY ${sortBy}
      LIMIT $2
      OFFSET $3
      ;`,
      values: [productId, count, offset],
    };
    return query;
  },

  addReviewPG: (review) => {
    const {
      product_id,
      rating,
      summary,
      body,
      recommend,
      reviewer_name,
      reviewer_email,
      photos,
      characteristics,
    } = review;

    const reviewQuery = {
      text: `INSERT INTO reviews
      (product_id, rating, summary, body, recommend, reviewer_name, reviewer_email, response, date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'review inserted', (SELECT EXTRACT (EPOCH FROM now())) * 1000)
      ;`,
      values: [product_id, rating, summary, body, recommend, reviewer_name, reviewer_email],
    };

    // TODO: fix query result
    return pool.connect()
      .then((client) => {
        client.query(reviewQuery)
          .then((result) => {
            console.log(result);
            const { review_id } = result.rows[0];
            const photo = [];
            for (let i = 0; i < photos.length; i += 1) {
              photo.push([review_id, photos[i]]);
            }
            client.query(format(`INSERT INTO photos (review_id, url) VALUES %L`, photo), []);
            return review_id;
          })
          .then((review_id) => {
            const characteristic = [];
            // eslint-disable-next-line prefer-const
            for (let key in characteristics) {
              characteristic.push([key, characteristics[key], review_id]);
            }
            return client.query(format(`INSERT INTO characteristics_reviews (characteristic_id, value, review_id) VALUES %L`, characteristic), []);
          })
          .catch((err) => {
            console.error(err);
          });
      });
  },

  getReviewMetaPG: (productId) => {
    const query = {
      text: `
      WITH tchars AS (SELECT id, name from characteristics WHERE product_id = ${productId})
      SELECT row_to_json(t)
      FROM (
        SELECT json_build_object(
          'product_id', '${productId}',
          'ratings', json_build_object(
            '1', (SELECT COUNT(rating) FROM reviews WHERE rating=1 AND product_id = ${productId}),
            '2', (SELECT COUNT(rating) FROM reviews WHERE rating=2 AND product_id = ${productId}),
            '3', (SELECT COUNT(rating) FROM reviews WHERE rating=3 AND product_id = ${productId}),
            '4', (SELECT COUNT(rating) FROM reviews WHERE rating=4 AND product_id = ${productId}),
            '5', (SELECT COUNT(rating) FROM reviews WHERE rating=5 AND product_id = ${productId})
          ),
          'recommended', json_build_object(
            '1', (SELECT COUNT(recommend) FROM reviews WHERE recommend=true AND product_id = ${productId}),
            '0', (SELECT COUNT(recommend) FROM reviews WHERE recommend=false AND product_id = ${productId})
          ),
          'characteristics', (SELECT json_object_agg(tchars.name, json_build_object('id', tchars.id, 'value', (SELECT avg(value) FROM characteristics_reviews WHERE characteristics_reviews.characteristic_id = tchars.id))) FROM tchars)
        )
      )t;`,
      values: [],
    };

    return query;
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
};
