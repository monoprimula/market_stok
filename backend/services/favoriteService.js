import db from '../models/index.js';

const { Favorite, Product, Category } = db;

class FavoriteService {

    //  Favoriye Ekle
    static async addFavorite(userId, productId) {
        const existing = await Favorite.findOne({
            where: { user_id: userId, product_id: productId }
        });

        if (existing) {
            throw new Error('Bu ürün zaten favorilerinizde.');
        }

        await Favorite.create({ user_id: userId, product_id: productId });
        return { message: 'Ürün favorilere eklendi.' };
    }

    // Favoriden Çıkar
    static async removeFavorite(userId, productId) {
        const deleted = await Favorite.destroy({
            where: { user_id: userId, product_id: productId }
        });

        if (deleted === 0) {
            throw new Error('Ürün favorilerde bulunamadı.');
        }

        return { message: 'Ürün favorilerden çıkarıldı.' };
    }

    // 3. Kullanıcının Favorilerini Listele
    static async getUserFavorites(userId) {

        const favorites = await Favorite.findAll({
            where: { user_id: userId },
            include: [{
                model: Product,
                include: [{ model: Category, as: 'category' }] 
            }]
        });
        return favorites.map(f => f.Product); 
    }
}

export default FavoriteService;