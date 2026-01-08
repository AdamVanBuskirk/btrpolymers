import express, { Router } from 'express';
import bodyParser from "body-parser";
const router: Router = express.Router();
const stripeController = require('../controllers/stripeController');

/* onetime setup use to pull plans into herdr */
//router.post('/create/plans', stripeController.createPlans);

router.get('/', stripeController.getPlans); 
router.get('/recent/payment/:companyId', stripeController.getMostRecentPayment);

//router.post('/', stripeController.createPlans); 
router.post('/create/subscription', stripeController.createSubscription); 
router.post('/cancel/subscription', stripeController.cancelSubscription);
router.post('/create-setup-intent', stripeController.createSetupIntent);
router.post('/set-default-payment', stripeController.setDefaultPayment);
//router.post('/get-payment-info', bodyParser.raw({ type: "application/json" }), stripeController.getPaymentInfo),
router.delete('/recent/payment/:companyId/:_id', stripeController.deleteMostRecentPayment);
module.exports = router;