import { Router } from 'express';
import { UserController } from '../controllers';
import { authenticateUser } from '../middlewares';

const router = Router();

// Authentication routes
router.post('/register', UserController.createUserUsingEmail);
router.post('/auth/google', UserController.authUserUsingGoogle);
router.post('/login', UserController.loginUser);
router.post('/logout', authenticateUser, UserController.logoutUser);
router.get('/refresh', authenticateUser, UserController.refreshUser);

// Password routes
router.get("/hasnopassword/:id", authenticateUser, UserController.hasNoPassword);
router.put('/change-password/:id', authenticateUser, UserController.changePassword);
router.post('/reset-password-email', UserController.resetPasswordEmail);
router.post('/reset-password/:token', UserController.resetPassword);

// Newsletter route
router.post('/newsletter', UserController.handleNewsletterSubscription);

// Products Reviews Reactions (likes/dislikes)
router.get('/product-reactions/:productId', authenticateUser, UserController.getUserProductReactions);

// WISHLIST ROUTES 
router.post('/wishlist/:productId', authenticateUser, UserController.addToWishlist);
router.get('/wishlist', authenticateUser, UserController.getWishlist);
router.delete('/wishlist/clear', authenticateUser, UserController.clearWishlist);
router.delete('/wishlist/:productId', authenticateUser, UserController.removeFromWishlist);

// User profile routes - THESE COME AFTER SPECIFIC ROUTES
router.get("/:id", authenticateUser, UserController.getUserById);
router.patch("/update/:id", authenticateUser, UserController.updateUser);

// Address routes
router.post("/address/:userId/", authenticateUser, UserController.addUserAddress);
router.patch("/update/:userId/address/:addressId", authenticateUser, UserController.updateUserAddress);
router.delete("/:userId/address/:addressId", authenticateUser, UserController.deleteUserAddress);

// Payment method routes
router.post("/payment/:userId/", authenticateUser, UserController.addUserPaymentMethod);
router.patch("/update/:userId/payment/:paymentId", authenticateUser, UserController.updateUserPaymentMethod);
router.delete("/:userId/payment/:paymentId", authenticateUser, UserController.deleteUserPaymentMethod);

// 2FA routes
router.post('/2fa/:userId', authenticateUser, UserController.enableTwoFactorAuth);
router.post('/2fa/generate/:id', UserController.generateTwoFactorAuthOTP);
router.post('/2fa/verify/:id', UserController.verifyTwoFactorAuth);
router.post('/account/reverify/:userId/:token', UserController.resendAccountVerificationEmail);
router.post('/account/verify/:token', UserController.verifyAccountEmail);

router.delete("/delete/:id", authenticateUser, UserController.deleteUser);

export default router;