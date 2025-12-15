import express from 'express';
import verifyToken from '../middleware/auth.js';
import checkRole from '../middleware/roleCheck.js';
import CategoryController from '../controllers/categoryController.js';

const router = express.Router();


router.get('/', verifyToken, CategoryController.getAll);

router.get('/:id', verifyToken, checkRole(['Admin', 'Staff']), CategoryController.getById);


// Sadece Admin kategori ekleyebilir, düzenleyebilir ve silebilir
router.post('/', verifyToken, checkRole(['Admin']), CategoryController.create);
router.put('/:id', verifyToken, checkRole(['Admin']), CategoryController.update);
router.delete('/:id', verifyToken, checkRole(['Admin']), CategoryController.delete);

export default router;