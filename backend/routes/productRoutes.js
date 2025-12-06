import express from 'express';
import verifyToken from '../middleware/auth.js';
import checkRole from '../middleware/roleCheck.js';
import ProductController from '../controllers/productController.js';

const router = express.Router();


router.get('/', verifyToken, ProductController.getAll);
router.get('/my-products', verifyToken, checkRole(['Admin', 'Staff']), ProductController.getMyProducts);
router.get('/:id', verifyToken, ProductController.getById);
router.post('/', verifyToken, checkRole(['Admin', 'Staff']), ProductController.create);
router.put('/:id', verifyToken, checkRole(['Admin', 'Staff']), ProductController.update);
router.delete('/:id', verifyToken, checkRole(['Admin']), ProductController.delete);

export default router;