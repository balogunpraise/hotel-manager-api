const express = require('express')
const bookingController = require('../Controllers/bookingController')
const {authMiddleware, restrictTo} = require('../Middlewares/authMiddleware')

const router = express.Router()

router.post('/', authMiddleware, restrictTo('receptionist', 'housekeeping', 'guest'), bookingController.bookRoom)

router.get('/:id', authMiddleware, restrictTo('receptionist', 'housekeeping', 'guest'), bookingController.getBookedRoomById)
router.get('/', authMiddleware, restrictTo('receptionist', 'housekeeping', 'guest'), bookingController.getAllBookedRooms)

router.patch('/:id', authMiddleware, restrictTo('receptionist', 'housekeeping', 'guest'), bookingController.updateBooking)

router.delete('/:id', authMiddleware, restrictTo('receptionist', 'housekeeping', 'guest'), bookingController.deleteBookedRoom)


module.exports = router