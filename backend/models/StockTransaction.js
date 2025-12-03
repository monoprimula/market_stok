import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const StockTransaction = sequelize.define('StockTransaction', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    
  //ÜRÜNBAĞLANTISI (F.K)
    product_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: 'Products',
            key: 'id'
        },
        onDelete: 'CASCADE', // Ürün silinirse geçmişi de silinsin (veya RESTRICT yapılabilir)
        onUpdate: 'CASCADE'
    },

   //USET BAĞLANTISI (F.K)
    user_id: { 
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        },
        onDelete: 'SET NULL', // Personel silinirse log kalsın, kullanıcı null olsun
        onUpdate: 'CASCADE'
    },

    transaction_type: { type: DataTypes.ENUM('IN', 'OUT'), allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    description: { type: DataTypes.STRING },
    transaction_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'StockTransactions', timestamps: false });

export default StockTransaction;