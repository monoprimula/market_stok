import db from '../models/index.js';

const { sequelize, Order, OrderDetail, Product, StockTransaction, User, Role } = db;

class OrderService {

    // Yeni Sipariş Oluşturma 
    static async createOrder(userId, items) {
        const t = await sequelize.transaction(); // 🚨 Transaction Başlat

        try {
            let totalAmount = 0;

            // Ürünleri tek tek kontrol et ve toplam tutarı hesapla
            for (const item of items) {
                const product = await Product.findByPk(item.product_id, { transaction: t });
                
                if (!product) {
                    throw new Error(`Ürün ID: ${item.product_id} bulunamadı.`);
                }
                if (product.stock_quantity < item.quantity) {
                    throw new Error(`Ürün '${product.name}' için stok yetersiz. Mevcut: ${product.stock_quantity}`);
                }

               
                item.price = product.price; 
                totalAmount += item.quantity * product.price;
            }

            // 2. Siparişi Kaydet (Orders Tablosu)
            const newOrder = await Order.create({
                user_id: userId,
                total_amount: totalAmount,
                status: 'Confirmed'
            }, { transaction: t });

            // 3. Sipariş Detaylarını Kaydet ve Stok Düş
            for (const item of items) {
                const subtotal = item.quantity * item.price;
                
                // Sipariş Detayı Ekle
                await OrderDetail.create({
                    order_id: newOrder.id,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    unit_price: item.price,
                    subtotal: subtotal
                }, { transaction: t });

                // Stoktan Düş (Products Tablosu)
                await Product.decrement('stock_quantity', { 
                    by: item.quantity, 
                    where: { id: item.product_id },
                    transaction: t 
                });

                // Stok Hareketini Logla (StockTransactions Tablosu)
                await StockTransaction.create({
                    product_id: item.product_id,
                    user_id: userId,
                    transaction_type: 'OUT',
                    quantity: item.quantity,
                    description: `Sipariş No: ${newOrder.id} ile satış`
                }, { transaction: t });
            }

            await t.commit(); // 🚨 Her şey başarılı: Kalıcı hale getir
            return { order: newOrder, message: 'Siparişiniz başarıyla onaylandı ve stok düşüldü.' };

        } catch (error) {
            await t.rollback(); // 🚨 Hata oldu: Başlangıç durumuna geri dön (Rollback)
            throw error;
        }
    }

    // 2. Kullanıcının Kendi Sipariş Geçmişi
    static async getUserOrders(userId) {
        return await Order.findAll({
            where: { user_id: userId },
            include: [{ model: OrderDetail, as: 'details', include: [{ model: Product, as: 'product' }] }],
            order: [['order_date', 'DESC']]
        });
    }

    // 3. Tüm Sipariş Geçmişi (Admin/Staff)
    static async getAllOrders() {
        return await Order.findAll({
            include: [
                { model: OrderDetail, as: 'details', include: [{ model: Product, as: 'product' }] },
                { model: User, as: 'customer', attributes: ['username', 'email'], include: [{ model: Role, as: 'role' }] }
            ],
            order: [['order_date', 'DESC']]
        });
    }
}

export default OrderService;