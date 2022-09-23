import express, { Router } from 'express';
import { productCreateSchema, productGetSchema } from '../middleware/validateRequest';
import * as ProductController from '../controller/productControllerr';

const router : Router  = express.Router();

// Register, it should be protected
router.post('/create', productCreateSchema, ProductController.createProductHandler);

// Fetched products with filter conditions
router.get('/get', productGetSchema, ProductController.getProductHandler)

export default router;