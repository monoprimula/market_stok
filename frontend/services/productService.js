import { api } from './api.js';

export const productService = {
    // Tüm ürünleri getir
    async getProducts(category = null) {
        try {
            
            const url = category && category !== 'Tümü' 
                ? `/products?category=${category}` 
                : '/products';
            
        
            const products = await api.get(url);
            return products; 
        } catch (error) {
            console.error('Ürünler yüklenirken hata:', error);
            return []; 
        }
    },
async getProductsByCreator() {
        try {
           
            const url = `/products/my-products`; 
    
        return await api.get(url); 
    } catch (error) {
        console.error('Personel ürünleri yüklenirken hata:', error);
        return [];
    }
},
    
    
   
    async updateProduct(id, productData) {
        try {
            return await api.put(`/products/${id}`, productData);
        } catch (error) {
            console.error('Ürün güncellenirken hata:', error);
            throw error; 
        }
    },
    

    async updateStock(id, newStock) {
        try {
            const dataToSend = { stock_quantity: newStock };
            return await api.put(`/products/${id}`, dataToSend);
        } catch (error) {
            console.error('Stok güncellenirken hata:', error);
            throw error;
        }
    },

    async getProductById(id) {
        try {
            return await api.get(`/products/${id}`);
        } catch (error) {
            console.error('Ürün detayı hatası:', error);
            return null;
        }
    },
    
    async createProduct(productData) {
        return await api.post('/products', productData);
    },
    
   
    async deleteProduct(id) {
        return await api.delete(`/products/${id}`);
    },

    async getDashboardStats() {
        try {
            // GET /api/reports/stats
            const response = await api.get('/reports/stats'); 
            return response.data;
        } catch (error) {
            console.error('Dashboard istatistikleri yüklenirken hata:', error);
            throw error;
        }
    },
    
    // Kritik Stoktaki Ürünleri Çekme
    async getLowStockProducts() {
        try {
            const response = await api.get('/reports/low-stock'); 
            return response.data;
        } catch (error) {
            console.error('Kritik stoktaki ürünler yüklenirken hata:', error);
            throw error;
        }
    }
};