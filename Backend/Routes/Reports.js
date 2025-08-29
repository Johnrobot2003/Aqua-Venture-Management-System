const Customer = require('../models/customers')
const express = require('express')
const router = express.Router()
const reportsController = require('../controllers/reports')


router.get('/', reportsController.getReports)

module.exports = router