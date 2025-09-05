const express = require('express');
const router = express.Router();
const walkInController = require('../controllers/walkIn');


router.get('/today', walkInController.getTodayWalkIns)
router.post('/checkin', walkInController.checkIn)
router.post('/checkout/:id', walkInController.checkOut)

module.exports = router;

