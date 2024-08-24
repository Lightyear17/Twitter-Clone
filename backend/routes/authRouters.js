import express from 'express';
import { signup, login, logout,getMe } from '../controllers/controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

var router = express.Router()

router.post('/signup',signup); 
router.post('/login',login);
router.post('/logout',logout);
router.get('/me', protectRoute,getMe);



export default router