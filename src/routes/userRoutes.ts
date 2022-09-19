import express from 'express';
import { createUserSchema } from '../middleware/validateRequest';
import * as UserController from '../controller/userController';

const router = express.Router();

// Register, it should be protected
router.post('/register', createUserSchema, UserController.createUserHandler);

export default router;