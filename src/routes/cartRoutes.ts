import express, { Router } from 'express';
import { addProductSchema, removeProductSchema} from '../middleware/validateRequest';
import * as CartController from '../controller/cartController';
import * as AuthMiddleware from '../middleware/auth'

const router:Router  = express.Router();

// Adding product to cart route
router.post('/:userId/addProduct', addProductSchema, AuthMiddleware.authentication, AuthMiddleware.authorizationByUserID, CartController.addProductToCarthandler)

// Removing product from cart route
router.put('/:userId/removeProduct', removeProductSchema, AuthMiddleware.authentication, AuthMiddleware.authorizationByUserID, CartController.removeProductFromCartHandler)

// Getting cart details route
router.get('/:userId/cartDetails', AuthMiddleware.authentication, AuthMiddleware.authorizationByUserID, CartController.getCartDetailsHandler)

// Emptying cart route
router.delete('/:userId/emptyCart', AuthMiddleware.authentication, AuthMiddleware.authorizationByUserID, CartController.emptyCartHandler)

export default router;