const express = require('express')
const router = express.Router() 
const authController = require('../controllers/Auth')


router.post('/register',authController.register);
router.post('/login', authController.login)
router.post('/logout',authController.logout)
router.get('/current-user',authController.getCurrentUser)
router.post('/change-password', authController.changePassword)

module.exports = router



