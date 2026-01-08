import express, { Router } from 'express';
const router: Router = express.Router();
const reportController = require('../controllers/reportController');

/* get routes */
router.get('/company/:companyId/team/:teamId/:weekChoice', reportController.getActionsLeaderboardReport);


router.post("/subscriptions", reportController.createSubscription);
router.put("/subscriptions/:id", reportController.updateSubscription);
router.post("/subscriptions/:id/enable", reportController.enableSubscription);
router.post("/subscriptions/:id/disable", reportController.disableSubscription);
router.post("/subscriptions/:id/run-now", reportController.runNow);
router.get("/company/:companyId/subscriptions/:reportType", reportController.getSubscriptionsByReportType);
router.delete("/company/:companyId/subscriptions/:id", reportController.deleteSubscription);


module.exports = router;