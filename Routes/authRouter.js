const express = require('express')
const authController = require('../Controllers/authController')
const protect = require('../Middlewares/authMiddleware')

const router = express.Router()

router.post ('/signUp', authController.signUp)
router.post('/login', authController.login)
router.post('/logout', authController.logout)


module.exports = router      