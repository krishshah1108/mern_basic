import express from 'express';
import authController from './controller/authController.js';
import upload from '../../middlewares/multer.js';
import uploadToCloudinary from '../../middlewares/uploadToCloudinary.js';
import authentication from '../../middlewares/authentication.js';
export const router = express.Router();

router.post(
  '/register',
  upload.single('profile'),
  uploadToCloudinary,
  authController.registerAndSendOtp,
);
router.post('/verifyOtp', authController.verifyOtpAndRegister);
router.post('/resendOtp', authController.resendOtpForRegistration);
router.post('/forgot-password', authController.forgotPasswordLink);
router.post('/reset-password', authController.validateTokenAndResetPassword);
router.post('/login', authController.userLogin);
router.post('/logout', authentication.isUserAuthenticated, authController.logout);
