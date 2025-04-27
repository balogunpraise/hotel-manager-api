const express = require('express')
const roomController = require('../Controllers/roomController')
const {authMiddleware, restrictTo} = require('../Middlewares/authMiddleware')


const router = express.Router()

router.post('/create', authMiddleware, restrictTo('admin'), roomController.createRoom )


router.get('/', authMiddleware, restrictTo('admin', 'manager'), roomController.getAllRooms)
router.get('/:id', authMiddleware, restrictTo('admin', 'manager'), roomController.getRoomById)


router.patch('/:id', authMiddleware, restrictTo('admin', 'manager'), roomController.updateRoom)

router.delete('/:id', authMiddleware, restrictTo('admin', 'manager'), roomController.deleteRoom)



module.exports = router