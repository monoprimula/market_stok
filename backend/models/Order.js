import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Order = sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    
    // MÜŞTERİ BAĞLANTISI (F.K)
    user_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        },
        onDelete: 'RESTRICT', // Siparişi olan kullanıcı silinemez
        onUpdate: 'CASCADE'
    },
    
    order_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: { 
        type: DataTypes.ENUM('Pending', 'Confirmed', 'Delivered', 'Cancelled'), 
        defaultValue: 'Confirmed' 
    }
}, { tableName: 'Orders', timestamps: false });

export default Order;