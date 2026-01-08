import express, { Router } from 'express';
const router: Router = express.Router();

const inviteController = require('../controllers/inviteController');

router.get('/company/:companyId/:link', inviteController.getCompany);
module.exports = router;