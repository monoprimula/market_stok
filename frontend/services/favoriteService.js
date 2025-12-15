/* eslint-disable no-unused-vars */
import { api } from './api.js';

export const favoriteService = {
    // Kullanıcının Favori Listesini Getir
    async getFavorites(userId) {
        try {
            const response = await api.get('/favorites');
            return response;
        } catch (error) {
            console.error('Favoriler yüklenemedi:', error);
            return [];
        }
    },

    // Favoriye Ekle
    async addFavorite(productId) { 
        try {
     
            await api.post('/favorites', { 
                product_id: productId 
            });
            return { success: true, message: 'Favorilere eklendi' };
        } catch (error) {
            const msg = error.response?.data?.message || 'Favorilere eklenirken hata oluştu.';
            return { success: false, message: msg };
        }
    },

    // Favoriden Çıkar
   async removeFavorite(productId) { 
        try {
            await api.delete(`/favorites/${productId}`); 
            return { success: true };
        } catch (error) {
            const msg = error.response?.data?.message || 'Favoriden çıkarılamadı.';
            return { success: false, message: msg };
        }
    }
};