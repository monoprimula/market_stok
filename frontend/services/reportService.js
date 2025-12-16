import {api} from './api.js';
import axios from 'axios';

const downloadApi = axios.create({
    baseURL: 'http://localhost:3000/api', 
    headers: {
        'Content-Type': 'application/json'
    }
});

downloadApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const reportService = {

    /**
     * @returns {Promise<Object>} İstatistikleri içeren bir obje döndürür.
     */
    async getDashboardStats() {
        try {
            const response = await api.get('/reports/stats');
            return response;
        } catch (error) {
            console.error('Dashboard istatistikleri yüklenirken hata:', error);
            throw error;
        }
    },

    /**
     * @returns {Promise<Array>} Kritik stoktaki ürünlerin listesi.
     */
    async getLowStockProducts() {
        try {
            const response = await api.get('/reports/low-stock');
            return response;
        } catch (error) {
            console.error('Kritik stoktaki ürünler yüklenirken hata:', error);
            throw error;
        }
    },

    /**
     * @returns {Promise<Blob>} İndirilecek dosyanın Blob verisi.
     */
    async downloadGeneralReport() {
      try {
           
            const response = await downloadApi.get('/reports/export', { 
                responseType: 'blob'
            });
            
            return response.data; 
        } catch (error) {
            if (error.response && error.response.data instanceof Blob) {

            const errorText = await error.response.data.text();
            throw new Error(JSON.parse(errorText).error || 'API Rapor Hatası.');
            } else {    
            throw error;
        }
    }
},
};