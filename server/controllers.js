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
  getReviews: (req, res) => {
    const {
      product_id, page = 1, count = 5, sort = 'newest',
    } = req.query;
  },

  /**
   * Route returning metadata for given product.
   * @property {number} product_id - Required ID of product for which data be returned.
   *
   * @param {*} req - Express request object
   * @param {*} res - Express response object
   */
  getReviewMeta: (req, res) => {
    const productId = req.query.product_id;
  },

  /**
   * Route adding a review for given product
   *
   * @param {*} req - Express request object
   * @param {*} res - Express response object
   */
  addReview: (req, res) => {

  },

  /**
   * Route updating a review to show it was found helpful.
   *
   * @param {*} req - Express request object
   * @param {*} res - Express response object
   */
  putHelpful: (req, res) => {
    const reviewId = req.params.review_id;
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
  },
};
