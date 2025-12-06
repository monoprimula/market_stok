import OrderService from '../services/orderService.js';

class OrderController {

    // POST /api/orders (Sepeti Onayla)
    static async createOrder(req, res) {
        try {
            
            const userId = req.user.id; 
            const { items } = req.body; 
        
            if (!items || items.length === 0) {
                return res.status(400).json({ message: "Sepetiniz boş." });
            }

            const result = await OrderService.createOrder(userId, items);
            res.status(201).json(result);
        } catch (error) {
            console.error("Sepet Onay Hatası:", error.message);
            res.status(400).json({ message: error.message });
        }
    }

    // GET /api/orders/my-orders
    static async getMyOrders(req, res) {
        try {
            const orders = await OrderService.getUserOrders(req.user.id);
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ message: "Sipariş geçmişi getirilemedi." + error.message });
        }
    }

    // GET /api/orders (Tüm Geçmiş - Admin/Staff)
    static async getAllOrders(req, res) {
        try {
            const orders = await OrderService.getAllOrders();
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ message: "Tüm sipariş listesi alınamadı." + error.message });
        }
    }
}

export default OrderController;