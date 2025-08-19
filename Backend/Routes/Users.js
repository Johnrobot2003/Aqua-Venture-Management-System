 const User = require('../models/users')
 const express = require('express')
const router = express.Router()
const passport = require('passport')
const userController = require('../controllers/users')
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth')
router.get('/',ensureAuthenticated,userController.getUsers)
router.get('/:id', ensureAuthenticated, userController.getUserById)
router.delete('/:id', ensureAuthenticated,userController.deleteUser)
router.patch('/:id',ensureAuthenticated, userController.updateUser)


module.exports = router