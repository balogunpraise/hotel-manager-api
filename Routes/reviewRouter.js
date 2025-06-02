const express = require('express')
const reviewController = require('../Controllers/reviewController')
const { authMiddleware, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router()

router.post('/', authMiddleware, restrictTo('guest'), reviewController.createReview )

router.put('/:id', authMiddleware, restrictTo('guest'), reviewController.updateReview)

router.get('/', authMiddleware, restrictTo('admin'), reviewController.getAllReviews )
router.get('/:id', authMiddleware, restrictTo('admin'), reviewController.getReviewById )

router.delete('/:id', authMiddleware, restrictTo('admin'), reviewController.deleteReview)

module.exports = router 