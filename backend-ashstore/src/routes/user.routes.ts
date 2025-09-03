
import { Router } from 'express';
import { UserController } from '../controllers';
import { authenticateUser } from '../middlewares';

const router = Router();

router.post('/register', UserController.createUserUsingEmail);
router.post('/auth/google', UserController.authUserUsingGoogle);
router.post('/login', UserController.loginUser);
router.post('/logout', authenticateUser, UserController.logoutUser);
router.get('/refresh', authenticateUser, UserController.refreshUser);

router.get("/hasnopassword/:id", authenticateUser, UserController.hasNoPassword);
router.put('/change-password/:id', authenticateUser, UserController.changePassword);
router.post('/reset-password-email', UserController.resetPasswordEmail);
router.post('/reset-password/:token', UserController.resetPassword);

router.get("/:id", authenticateUser, UserController.getUserById);
router.patch("/update/:id", authenticateUser, UserController.updateUser);
router.delete("/delete/:id", authenticateUser, UserController.deleteUser);

//////////* New Routes *////////////////////
// to enable 2fa option
// Just to enable 2FA of that user
router.post('/2fa/enable', authenticateUser, UserController.enableTwoFactorAuth);
// OTP Re-Generation if didn't received
router.post('/2fa/generate/:id', UserController.generateTwoFactorAuthOTP);
// OTP Verification
router.post('/2fa/verify/:id', UserController.verifyTwoFactorAuth);
// Account Verification Email
router.post('/account/reverify/:userId/:token', UserController.resendAccountVerificationEmail);
router.post('/account/verify/:token', UserController.verifyAccountEmail);

export default router;