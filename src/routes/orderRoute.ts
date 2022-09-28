import express, { Router } from 'express';
import { orderCreateSchema } from '../middleware/validateRequest';
import * as OrderController from '../controller/orderController';
import * as AuthMiddleware from '../middleware/auth';

const router : Router  = express.Router();

// Creating Order route
router.post('/:userId/create', orderCreateSchema, AuthMiddleware.authentication, AuthMiddleware.authorizationByUserID, OrderController.createOrderhandler)

export default router;