const express = require('express')
const authController = require('../Controllers/authController')
const {authMiddleware, restrictTo} = require('../Middlewares/authMiddleware')

const router = express.Router()

router.post ('/signUp', authController.signUp)
router.post('/login', authController.login)
router.post('/logout', authController.logout)

router.delete('/users/:id', authMiddleware,  restrictTo('admin'), authController.deleteUser)


module.exports = router      