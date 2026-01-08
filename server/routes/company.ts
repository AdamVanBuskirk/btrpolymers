import express, { Router } from 'express';
const router: Router = express.Router();
const companyController = require('../controllers/companyController');

/* get routes */
router.get('/info/:companyId', companyController.getCompanyInfoById);
router.get('/prospect/types', companyController.getProspectTypes);
router.get('/actions', companyController.getActions);
router.get('/amounts', companyController.getAmounts);
router.get('/industries', companyController.getIndustries);
router.get('/role', companyController.getRoles);
router.get('/:companyId/member', companyController.getMembers);
router.get('/:companyId/team', companyController.getTeams);
router.get('/:companyId/outreach', companyController.getOutreach);
router.get('/:companyId/prospect', companyController.getProspects);
router.get('/:companyId/actions', companyController.getCompanyActions);
router.get('/:companyId/amounts', companyController.getCompanyAmounts);
router.get('/:companyId/stories', companyController.getSuccessStories);

/* post routes */
router.post('/', companyController.saveCompany);
router.post('/team', companyController.createTeam);
router.post('/outreach', companyController.saveOutreach);
router.post('/goal', companyController.saveGoal);
router.post('/prospect', companyController.saveProspect);
router.post('/invite', companyController.inviteUser);
router.post('/invite/resend', companyController.reInviteUser);
router.post('/custom/actions/amounts', companyController.saveCustomActionsAndAmounts);
router.post('/team/members', companyController.saveTeamMembers);

/* put routes */
router.put('/team', companyController.saveTeam);
router.put('/user', companyController.saveUser);
router.put('/archive/success', companyController.archiveSuccess);

/* delete routes */
router.delete('/team/:teamId', companyController.deleteTeam);
router.delete('/prospect/:prospectId', companyController.deleteProspect);
router.delete('/outreach/:outreachId', companyController.deleteOutreach);

router.delete('/:companyId/user/:userId', companyController.deleteUser);
router.delete('/user/invite/:companyId/:email', companyController.deleteUserInvite);

module.exports = router;