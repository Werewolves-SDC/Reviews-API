/* eslint-disable camelcase */
const queries = require('../db/postgres/queries/queries');
const pool = require('../db/postgres/index');

module.exports = {
  /**
   * Route returning reviews of particular product_id.
   * @typedef {object} showRequestQuery
   * @property {number} page Selects the page of results to return, default 1
   * @property {number} count how many results per page to return, default 5
   * @property {string} sort Changes the sort order of reviews to be based on 'newest', 'helpful',
   * or 'relevent'
   * @property {number} product_id Specifies the product for which to retrieve reviews.
   *
   * @param req - Express request object
   * @param res - Express response object
   */
  getReviews: async (req, res) => {
    try {
      const productId = req.query.product_id;
      const {
        page = 1, count = 5, sort = 'newest',
      } = req.query;
      const reviewQuery = queries.getReviewPG(productId, page, count, sort);
      const { rows: reviews } = await pool.query(reviewQuery.text, reviewQuery.values);
      res.status(200).send(reviews);
    } catch (err) {
      res.status(500).send(err);
    }
  },

  /**
   * Route returning metadata for given product.
   * @property {number} product_id - Required ID of product for which data be returned.
   *
   * @param {*} req - Express request object
   * @param {*} res - Express response object
   */
  getReviewMeta: async (req, res) => {
    try {
      const productId = req.query.product_id;
      const metaQuery = queries.getReviewMetaPG(productId);
      const { rows: reviewMeta } = await pool.query(metaQuery);
      res.status(200).send(reviewMeta[0].row_to_json.json_build_object);
    } catch (err) {
      res.status(500).send(err);
    }
  },

  /**
   * Route adding a review for given product
   *
   * @param {*} req - Express request object
   * @param {*} res - Express response object
   */
  addReview: (req, res) => {
    queries.addReviewPG(req.body)
      .then(() => {
        res.status(201).send('Review Posted');
      }).catch((err) => {
        res.stauts(500).send(err);
      });
  },

  /**
   * Route updating a review to show it was found helpful.
   *
   * @param {*} req - Express request object
   * @param {*} res - Express response object
   */
  putHelpful: (req, res) => {
    const reviewId = req.params.review_id;
    queries.addHelpful(reviewId)
      .then((result) => {
        res.status(204).send(result);
      }).catch((err) => {
        res.status(500).send(err);
      });
  },

  /**
   * Route updating a review to show it's reported.
   * It does not delete the review, but review will not be returned in getReviews.
   *
   * @param {*} req - Express request object
   * @param {*} res - Express response object
   */
  putReport: (req, res) => {
    const reviewId = req.params.review_id;
    queries.addReport(reviewId)
      .then((result) => {
        res.status(204).send(result);
      }).catch((err) => {
        res.status(500).send(err);
      });
  },
};
