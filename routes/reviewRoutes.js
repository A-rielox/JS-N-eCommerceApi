// '/api/v1/reviews'
const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');
const {
   createReview,
   getAllReviews,
   getSingleReview,
   updateReview,
   deleteReview,
} = require('../controllers/reviewController');

router.route('/').get(getAllReviews).post(authenticateUser, createReview);

// ===== al final
router
   .route('/:id')
   .get(getSingleReview)
   .patch(authenticateUser, updateReview)
   .delete(authenticateUser, deleteReview);

module.exports = router;
