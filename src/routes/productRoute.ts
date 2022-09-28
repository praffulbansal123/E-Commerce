import express, { Router } from 'express';
import { productCreateSchema, productGetSchema, productUpdateSchema } from '../middleware/validateRequest';
import * as ProductController from '../controller/productControllerr';

const router : Router  = express.Router();

// Register, it should be protected
router.post('/create', productCreateSchema, ProductController.createProductHandler);

// Fetched products with filter conditions
router.get('/get', productGetSchema, ProductController.getProductHandler)

// Get product by productId
router.get('/get/:productId', ProductController.getProductByIdHandler )

// Update product route
router.put('/update/:productId', productUpdateSchema, ProductController.updateProductHandler)

// Deletre product route
router.delete('/delete/:productId', ProductController.deleteProductHandler)

export default router;