const Router = require('express-promise-router');
const controllers = require('./controllers');

const router = new Router();

router.get('/', controllers.getReviews);
router.get('/meta', controllers.getReviewMeta);
router.post('/', controllers.addReview);
router.put('/:review_id/helpful', controllers.putHelpful);
router.put('/:review_id/report', controllers.putReport);

module.exports = router;
