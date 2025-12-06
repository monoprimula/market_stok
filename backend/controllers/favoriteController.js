import FavoriteService from '../services/favoriteService.js';

class FavoriteController {

    // POST /api/favorites
    static async add(req, res) {
        try {
            const { product_id } = req.body;
            const result = await FavoriteService.addFavorite(req.user.id, product_id);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // DELETE /api/favorites/:productId
    static async remove(req, res) {
        try {
            const result = await FavoriteService.removeFavorite(req.user.id, req.params.productId);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // GET /api/favorites
    static async list(req, res) {
        try {
            const favorites = await FavoriteService.getUserFavorites(req.user.id);
            res.status(200).json(favorites);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default FavoriteController;