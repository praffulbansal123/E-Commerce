import express, { Router } from 'express';
import { createUserSchema, loginSchema, updateSchema } from '../middleware/validateRequest';
import * as UserController from '../controller/userController';
import * as AuthMiddleware from '../middleware/auth'

const router : Router  = express.Router();

// Register, it should be protected
router.post('/register', createUserSchema, UserController.createUserHandler);

// Login
router.post('/login', loginSchema, UserController.loginHandler);

// Get User details
router.get('/getDetails/:userId', AuthMiddleware.authentication, UserController.getUserDetailsHandler)

// Update user details
router.put('/updateUser/:userId',updateSchema, AuthMiddleware.authentication, AuthMiddleware.authorizationByUserID, UserController.updateUserDetailsHandler )

// Logout
router.get('/logout', UserController.logoutHandler);

export default router;