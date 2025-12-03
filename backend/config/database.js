import { Sequelize } from 'sequelize';
import 'dotenv/config'; 
import process from 'process';


export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false, 
    }
);

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Veritabanı bağlantısı başarılı.');
    } catch (error) {
        console.error('❌ Bağlantı hatası:', error);
        process.exit(1);
    }
};