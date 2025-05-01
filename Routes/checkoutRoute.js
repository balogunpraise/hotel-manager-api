const express = require('express')
const checkoutController = require('../Controllers/checkoutController')
const {authMiddleware, restrictTo} = require('../Middlewares/authMiddleware')

const router = express.Router()

router.post('/:bookingId', authMiddleware, restrictTo('receptionist', 'housekeeping', 'guest'), checkoutController.checkoutRoom )


module.exports = router