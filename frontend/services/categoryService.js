// frontend/services/categoryService.js

import { api } from './api.js';

export const categoryService = {
   
    async getCategories() {
        try {

            const categories = await api.get('/categories');
            return categories; 
        } catch (error) {
            console.error('Kategoriler yüklenemedi:', error);
            throw error; 
        }
    },

    async getCategoryById(id) {
        try {
            return await api.get(`/categories/${id}`);
        } catch (error) {
            console.error(`Kategori detayı (${id}) yüklenirken hata:`, error);
            throw error;
        }
    },

    async createCategory(data) {
        try {
            return await api.post('/categories', data);
        } catch (error) {
            console.error('Kategori oluşturulurken hata:', error);
            throw error;
        }
    },


    async updateCategory(id, data) {
        try {
            return await api.put(`/categories/${id}`, data);
        } catch (error) {
            console.error(`Kategori güncellenirken (${id}) hata:`, error);
            throw error;
        }
    },


    async deleteCategory(id) {
        try {
            return await api.delete(`/categories/${id}`);
        } catch (error) {
            console.error(`Kategori silinirken (${id}) hata:`, error);
            throw error;
        }
    }
};