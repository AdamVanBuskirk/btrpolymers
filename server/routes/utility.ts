import express, { Router } from 'express';
const router: Router = express.Router();

const utilityController = require('../controllers/utilityController');

router.post('/email/sales', utilityController.emailSales);

module.exports = router;