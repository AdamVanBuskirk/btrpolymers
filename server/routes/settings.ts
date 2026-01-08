import express, { Router } from 'express';
const router: Router = express.Router();
const settingsController = require('../controllers/settingsController');

router.get('/', settingsController.getSettings);
router.get('/other/companies/:companyId', settingsController.getOtherCompanies);
router.get('/quickstats/:companyId/:scope/:timeframe/:teamId', settingsController.getQuickStats);
router.get('/heartbeat', settingsController.heartbeat);
router.put('/component', settingsController.loadComponent);
router.put('/subcomponent', settingsController.loadSubComponent);
router.put('/previous/component', settingsController.savePreviousComponent);
router.put('/sidebar', settingsController.expandSidebar);
router.put('/loaded/company', settingsController.updateLoadedCompanyId);
router.put('/stats/scope', settingsController.setStatsScope);
router.put('/stats/team', settingsController.setStatsTeam);
router.put('/stats/timeframe', settingsController.setStatsTimeframe);

module.exports = router;