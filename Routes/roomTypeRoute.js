const express = require('express')
const roomTypeController = require('../Controllers/roomTypeController')
const {authMiddleware, restrictTo} = require('../Middlewares/authMiddleware')

const router = express.Router()

router.post('/roomClasses', authMiddleware, restrictTo('admin'), roomTypeController.roomClasses)

router.get('/allClasses', authMiddleware, restrictTo('admin'), roomTypeController.getAllRoomClasses)
router.get('/roomClass/:id', authMiddleware, restrictTo('admin'), roomTypeController.getRoomClassesById)
router.patch('/updateClass', authMiddleware, restrictTo('admin'), roomTypeController.updateRoomClass)

router.delete('/roomClass/:id', authMiddleware, restrictTo('admin'), roomTypeController.deleteRoomClass)

module.exports = router