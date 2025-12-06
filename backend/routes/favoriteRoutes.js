import express from 'express';
import verifyToken from '../middleware/auth.js';
import FavoriteController from '../controllers/favoriteController.js';

const router = express.Router();


router.use(verifyToken);

router.get('/', FavoriteController.list);         
router.post('/', FavoriteController.add);           
router.delete('/:productId', FavoriteController.remove); 
export default router;