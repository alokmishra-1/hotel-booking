import { login, register } from '../controller/authController.js'
import { Router } from 'express';
import {protect,adminOnly} from '../middleware/authMiddleware.js'

const router = Router();


// Protected Routes
router.get('/me',protect,(req,res)=>{
    res.json({mssg:"You are logged",user:req.user})
})

// Admin protected routes
router.get('/admin-test',protect,adminOnly,(req,res)=>{
    res.json({mssg:"Welcome admin"})
})



router.post('/register',register);
router.post('/login', login);

export default router