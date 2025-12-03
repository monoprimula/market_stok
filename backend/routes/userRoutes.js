import express from 'express';
import verifyToken from '../middleware/auth.js';
import checkRole from '../middleware/roleCheck.js';
import UserController from '../controllers/userController.js';

const router = express.Router();

// Tüm rotalar için Token ve Admin kontrolünü zorunlu kıl
router.use(verifyToken, checkRole(['Admin']));


router.get('/', UserController.listUser);
router.put('/:id/role', UserController.updateUserRole);
router.delete('/:id', UserController.deleteUser);

export default router;