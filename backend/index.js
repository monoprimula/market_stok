// index.js (Güncel)
import express from 'express';
import cors from 'cors';
import 'dotenv/config'; 
import { connectDB } from './config/database.js';
import process from 'process';

// Rota Dosyalarını İçe Aktar
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import userRoutes from './routes/userRoutes.js'


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json()); 

// Rotalar
app.use('/api/auth', authRoutes); 
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Market Stok Takip API Çalışıyor 🚀');
});

const startServer = async () => {
    await connectDB();
    
    app.listen(PORT, () => {
        console.log(`🚀 Sunucu http://localhost:${PORT} adresinde yayında!`);
    });
};

startServer();