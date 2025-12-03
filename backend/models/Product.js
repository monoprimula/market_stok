import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Product = sequelize.define('Product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    
    // KATEGORİ BAĞLANTISI (F.K)
    category_id: { 
        type: DataTypes.INTEGER, 
        allowNull: true,
        references: {
            model: 'Categories',
            key: 'id'
        },
        onDelete: 'SET NULL', 
        onUpdate: 'CASCADE'
    },

    // ürünü ekleyen personelin kim olduğu bilgisi  // USER BAĞLANTISI (F.K)
    created_by: { 
        type: DataTypes.INTEGER, 
        allowNull: true,
        references: {
            model: 'Users',
            key: 'id'
        },
        onDelete: 'SET NULL', // Personel silinirse ürün silinmesin
        onUpdate: 'CASCADE'
    },

    barcode_no: { type: DataTypes.STRING, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.00 },
    stock_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    image_url: { type: DataTypes.STRING }
}, { tableName: 'Products', timestamps: true, createdAt: 'created_at', updatedAt: false });

export default Product;