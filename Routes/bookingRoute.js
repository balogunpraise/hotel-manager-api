const express = require('express')
const bookingController = require('../Controllers/bookingController')
const {authMiddleware, restrictTo} = require('../Middlewares/authMiddleware')

const router = express.Router()

router.post('/', authMiddleware, restrictTo('receptionist', 'housekeeping', 'guest'), bookingController.bookRoom)

router.get('/:bookingId', authMiddleware, restrictTo('receptionist', 'housekeeping', 'guest'), bookingController.getBookedRoomById)
router.get('/', authMiddleware, restrictTo('receptionist', 'housekeeping', 'admin'), bookingController.getAllBookedRooms)

router.patch('/:bookingId', authMiddleware, restrictTo('receptionist', 'housekeeping', 'guest'), bookingController.updateBooking)

router.delete('/:bookingId', authMiddleware, restrictTo('receptionist', 'housekeeping', 'guest'), bookingController.cancelBooking)


module.exports = router