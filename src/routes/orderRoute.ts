import express, { Router } from 'express';
import { orderCreateSchema, updateOrderStatusSchema } from '../middleware/validateRequest';
import * as OrderController from '../controller/orderController';
import * as AuthMiddleware from '../middleware/auth';

const router : Router  = express.Router();

// Creating Order route
router.post('/:userId/create', orderCreateSchema, AuthMiddleware.authentication, AuthMiddleware.authorizationByUserID, OrderController.createOrderhandler)

// Updating Order status route
router.put('/:userId/:orderId', updateOrderStatusSchema, AuthMiddleware.authentication, AuthMiddleware.authorizationByUserID, OrderController.orderStatusHandler)

export default router;