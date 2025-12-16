/* eslint-disable no-unused-vars */
import { api } from './api.js';

export const authService = {
    // Giriş Yapma
    async login(email, password) {
        try {
            const response = await api.post('/auth/login', { email, password });
            
            if (response.token) {
                localStorage.setItem('token', response.token);
              
                localStorage.setItem('user', JSON.stringify(response.user));
                return { success: true, user: response.user };
            }
            return { success: false, message: 'Token alınamadı.' };
        } catch (error) {
            const msg = error.response?.data?.message || 'Giriş başarısız.';
            return { success: false, message: msg };
        }
    },

    // Kayıt Olma
    async register(userData) {
        try {
            await api.post('/auth/register', userData);
            return { success: true, message: 'Kayıt başarılı! Giriş yapabilirsiniz.' };
        } catch (error) {
            const msg = error.response?.data?.message || 'Kayıt başarısız.';
            return { success: false, message: msg };
        }
    },

    // Çıkış Yapma
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user'); 
        localStorage.removeItem('cart');
        window.location.hash = '#/login';
    },

    // Mevcut Kullanıcıyı Getir 
    getCurrentUser() {
       
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch (e) {
            return null;
        }
    },

    // Token Var mı?
    isLoggedIn() {
        return !!localStorage.getItem('token');
    },

    async getAllUsers() {
        try {
            return await api.get('/users');
        } catch (error) {
            console.error('Kullanıcılar yüklenirken hata:', error);
            throw error;
        }
    },

   async updateUserRole(userId, newRoleId) { 
        try {
            const dataToSend = { role_id: newRoleId }; 
        return await api.put(`/users/${userId}/role`, dataToSend); 
        } catch (error) {
            console.error(`Kullanıcı rolü güncellenirken hata (${userId}):`, error);
            throw error;
        }
    },

    async deleteUser(userId) {
        try {
            return await api.delete(`/users/${userId}`);
        } catch (error) {
            console.error(`Kullanıcı silinirken hata (${userId}):`, error);
            throw error;
        }
    }

    
};