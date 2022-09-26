import express, { Router } from 'express';
import { addProductSchema } from '../middleware/validateRequest';
import * as CartController from '../controller/cartController';
import * as AuthMiddleware from '../middleware/auth'

const router : Router  = express.Router();

// Adding product to cart route
router.post('/:userId/addProduct', addProductSchema, AuthMiddleware.authentication, AuthMiddleware.authorizationByUserID, CartController.addProductToCarthandler)

export default router;