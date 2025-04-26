const express = require('express')
const roomController = require('../Controllers/roomController')
const {authMiddleware, restrictTo} = require('../Middlewares/authMiddleware')

const router = express.Router()

router.post('/create', authMiddleware, restrictTo('admin'), roomController.createRoom )
router.get('/', authMiddleware, restrictTo('admin', 'manager'), roomController.getAllRooms)



module.exports = router