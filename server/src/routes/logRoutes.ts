import { Router } from 'express';
import passport from 'passport';
import {
  isAuth,
  getMe,
  logout,
  createLog,
  getLogs,
  getChartData,
} from '../controllers/logController';

const router = Router();

// Google Auth
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: process.env.CLIENT_APP_URL,
    failureRedirect: '/login'
  })
);

// Logout
router.post('/auth/logout', logout);

// Current user
router.get('/me', getMe);

// Logs
router.post('/logs', isAuth, createLog);
router.get('/logs', isAuth, getLogs);
router.get('/logs/chart-data', isAuth, getChartData);

export default router;
