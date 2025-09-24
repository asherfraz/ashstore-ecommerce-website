import { Router } from 'express';
import ProductController from '../controllers/product.controller';
import { authenticateUser, authorizeRoles } from '../middlewares';

const router = Router();

// Public routes
router.get('/', ProductController.getProducts);
router.get('/seller', authenticateUser, authorizeRoles('seller', 'both', 'admin'), ProductController.getSellerProducts);
router.get('/:id', ProductController.getProductById);
router.get('/:id/reviews', ProductController.getProductReviews);

// Protected routes (require authentication)
router.post('/:id/reviews', authenticateUser, ProductController.addProductReview);
router.post('/:id/reviews/:reviewId/reply', authenticateUser, ProductController.addReviewReply);

// Seller and admin routes (require authentication & Authorization)
router.post('/', authenticateUser, authorizeRoles('seller', 'both', 'admin'), ProductController.createProduct);
router.put('/:id', authenticateUser, authorizeRoles('seller', 'both', 'admin'), ProductController.updateProduct);

router.delete('/archive/:id', authenticateUser, authorizeRoles('seller', 'both', 'admin'), ProductController.archiveProduct);
router.delete('/:id', authenticateUser, authorizeRoles('seller', 'both', 'admin'), ProductController.deleteProduct);

router.patch('/:id/stock', authenticateUser, authorizeRoles('seller', 'both', 'admin'), ProductController.updateProductStock);
router.patch('/:id/status', authenticateUser, authorizeRoles('seller', 'both', 'admin'), ProductController.updateProductStatus);



export default router;