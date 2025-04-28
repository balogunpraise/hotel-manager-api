const express = require('express')
const authController = require('../Controllers/authController')
const {authMiddleware, restrictTo} = require('../Middlewares/authMiddleware')

const router = express.Router()

router.post ('/signUp', authController.signUp)
router.post ('/admin/signUp', authController.signUpAdmin)
router.post('/login', authController.login)
router.post('/logout', authController.logout)

router.post('/newRole/:id', authMiddleware, restrictTo('admin'), authController.roleChange)
router.post('/removeRole/:id', authMiddleware, restrictTo('admin'), authController.removeRole)
router.delete('/:id', authMiddleware,  restrictTo('admin'), authController.deleteUser)
router.get('/', authMiddleware,  restrictTo('admin'), authController.getAllUsers)



module.exports = router      