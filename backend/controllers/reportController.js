import ReportService from '../services/reportService.js';
import { Parser } from 'json2csv'; 

class ReportController {

    // GET /api/reports/stats 
    static async getStats(req, res) {
        try {
            const stats = await ReportService.getDashboardStats();
            res.status(200).json(stats);
        } catch (error) {
            res.status(500).json({ message: "İstatistikler alınamadı: " + error.message });
        }
    }

    // GET /api/reports/export
    static async downloadGeneralReportCSV(req, res) {
        try {
            // Dashboard verilerini çek 
            const stats = await ReportService.getDashboardStats();
            const data = [
                {
                    'Toplam Ürün Sayısı': stats.totalProducts,
                    'Toplam Kullanıcı': stats.totalUsers,
                    'Toplam Sipariş': stats.totalOrders,
                    'Kritik Stoklu Ürün Sayısı': stats.lowStockCount,
                    'Toplam Ciro (TL)': stats.totalRevenue
                }
            ];

          
            const json2csvParser = new Parser({ 
                fields: ['Toplam Ürün Sayısı', 'Toplam Kullanıcı', 'Toplam Sipariş', 'Kritik Stoklu Ürün Sayısı', 'Toplam Ciro (TL)'],
                delimiter: ',' 
            });
            
            const csv = json2csvParser.parse(data);

            // 4. Dosyayı İndir
            res.header('Content-Type', 'text/csv');
            res.attachment('genel_durum_raporu.csv');
            
            return res.send(csv);

        } catch (error) {
            res.status(500).json({ message: "Rapor oluşturulamadı: " + error.message });
        }
    }
}

export default ReportController;