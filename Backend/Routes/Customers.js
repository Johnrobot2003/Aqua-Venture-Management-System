  const Customer = require('../models/customers')
  const express = require('express')
  const router = express.Router()
  const customerController = require('../controllers/customers')

  router.get('/', customerController.getCustomers)
  router.get('/:id', customerController.getCustomerById)
  router.post('/', customerController.registerCustomer)
  router.delete('/:id', customerController.deleteCustomer)
  router.patch('/:id', customerController.updateCustomer)
  router.post('/:id/checkIn', customerController.checkInCustomer)
  router.post('/:id/checkOut', customerController.checkOutCustomer)
  router.get('/:id/checkins', customerController.getCheckIns)

  module.exports = router