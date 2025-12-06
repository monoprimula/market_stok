import { Op } from 'sequelize';
import db from '../models/index.js';

const { Product, User, Order, Category } = db;

class ReportService {

    // Dashboard İstatistikleri
    static async getDashboardStats() {
      
        const [totalProducts, totalUsers, totalOrders, lowStockCount, totalRevenue] = await Promise.all([
            
            // Toplam Ürün Sayısı
            Product.count(),
            
            // Toplam Kullanıcı Sayısı
            User.count(),
            
            // Toplam Sipariş Sayısı
            Order.count(),
            
            // Stoğu Kritik Seviyenin  Altında Olanlar
            Product.count({
                where: { stock_quantity: { [Op.lt]: 10 } }
            }),

            // Toplam Ciro 
            Order.sum('total_amount')
        ]);

        return {
            totalProducts,
            totalUsers,
            totalOrders,
            lowStockCount,
            totalRevenue: totalRevenue || 0 // Eğer hiç sipariş yoksa null yerine 0 dön
        };
    }

    // 2. Kritik Stoktaki Ürünleri Listele
    static async getLowStockProducts() {
        return await Product.findAll({
            where: { 
                stock_quantity: { [Op.lt]: 10 }
            },
            include: [
                { model: Category, as: 'category', attributes: ['name'] }
            ],
            order: [['stock_quantity', 'ASC']] 
        });
    }
}

export default ReportService;