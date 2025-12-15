// backend/routes/cartRoutes.js
import express from 'express';
import CartController from '../controllers/cartController.js';
import verifyToken from '../middleware/auth.js'; 

const router = express.Router();

router.use(verifyToken); 


router.get('/', CartController.getCart);
router.post('/', CartController.addToCart);
router.put('/', CartController.updateQuantity);
router.delete('/:productId', CartController.removeFromCart); 
//sepeti temizle:
router.delete('/', CartController.clearCart); 
router.post('/confirm', CartController.confirmCart);

export default router;