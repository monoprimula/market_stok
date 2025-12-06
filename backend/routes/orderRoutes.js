import express from 'express';
import verifyToken from '../middleware/auth.js';
import checkRole from '../middleware/roleCheck.js';
import OrderController from '../controllers/orderController.js';
const router = express.Router();


router.post('/', verifyToken, OrderController.createOrder);

router.get('/my-orders', verifyToken, OrderController.getMyOrders);

router.get('/', 
    verifyToken, 
    checkRole(['Admin', 'Staff']), 
    OrderController.getAllOrders
);

export default router;