import { Router } from 'express';
import AuthCheck from '../middlewares/auth.middleware.js';
import productController from '../controller/product.controller.js';
import upload from '../config/multer.config.js';

const router = Router();

router.use(AuthCheck);

// http://lcoalhost:5000/api/products GET
router.route('/').get(productController.fetchProductsHandler);

// http://lcoalhost:5000/api/products/:productId GET
router.route('/:productId').get(productController.fetchProductHandler);

// http://lcoalhost:5000/api/products/ POST
router
	.route('/')
	.post(upload.single('image'), productController.createProductHandler);

// http://lcoalhost:5000/api/products/:productId PUT
router
	.route('/:productId')
	.put(upload.single('image'), productController.updateProductHandler);

// http://lcoalhost:5000/api/products/:productId DELETE
router.route('/:productId').delete(productController.deleteProductHandler);

export default router;
