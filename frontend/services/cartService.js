/* eslint-disable no-unused-vars */
import { api } from './api.js';

export const cartService = {
    // Sepeti Getir
    async getCart() {
        try {
            const response = await api.get('/cart'); 
            return response; 
        } catch (error) {
            console.error('Sepet yüklenemedi:', error);
            return [];
        }
    },

    // Sepete Ekle
    async addToCart(productId, quantity = 1) {
        try {
        await api.post('/cart', { 
            product_id: productId, 
            quantity 
        });
        return { success: true, message: 'Ürün sepete eklendi' };
    } catch (error) {
        
        const msg = error.response?.data?.message || 'Sepete eklenirken hata oluştu';
        return { success: false, message: msg };
    }
    },

    // Sepetten Sil
    async removeFromCart(productId) {
        try {
            await api.delete(`/cart/${productId}`); 
            return { success: true };
        } catch (error) {
            const msg = error.response?.data?.message || 'Silme işlemi başarısız.';
            return { success: false, message: msg };
        }
    },

    // Miktar Güncelle
    async updateQuantity(productId, quantity) {
        try {
            
            const response = await api.put('/cart', { 
                product_id: productId, 
                quantity 
            }); 
        
            return { success: true, data: response }; 
        } catch (error) {
            const msg = error.response?.data?.message || 'Miktar güncellenemedi.';
            return { success: false, message: msg };
        }
    },

    // Sepeti Temizle
    async clearCart() {
        try {
            await api.delete('/cart');
            return { success: true };
        } catch (error) {
            const msg = error.response?.data?.message || 'Sepet temizlenemedi.';
            return { success: false, message: msg };
        }
    },

    // Sepeti Onayla
    async confirmCart() {
        try {
            const response = await api.post('/cart/confirm', {});
            return { success: true, message: response.message };
        } catch (error) {
            const msg = error.response?.data?.message || 'Sepet onaylanırken bir hata oluştu.';
            return { success: false, message: msg };
        }
    }
};