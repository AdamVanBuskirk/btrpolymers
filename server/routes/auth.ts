//import { Express, Router } from "express";

//const express = require('express');
//const router = express.Router();
import express, { Router } from 'express';
const router: Router = express.Router();

const authController = require('../controllers/authController');

router.get('/avatar', authController.getAvatar);
router.post('/login', authController.handleLogin);
router.post('/login/social', authController.handleSocialLogin);
router.post('/register', authController.handleNewUser);
router.get('/refresh', authController.handleRefreshToken);
router.get('/logout', authController.handleLogout);
router.post('/activate', authController.activateUser);
router.post('/activate/resend', authController.resendActivationCode);
router.post('/password/recover', authController.sendRecoveryLink);
router.post('/password/change', authController.changePassword);

module.exports = router;