import { Router } from 'express';
import authController from '../controller/auth.controller.js';
import AuthCheck from '../middlewares/auth.middleware.js';
import upload from '../config/multer.config.js';

const router = Router();

router
	.route('/register')
	.post(upload.single('image'), authController.registerHandler);
router.route('/login').post(authController.loginHandler);
router.route('/profile').get(AuthCheck, authController.fetchProfileHandler);
router
	.route('/profile/update')
	.put(AuthCheck, upload.single('image'), authController.updateProfileHandler);

export default router;
