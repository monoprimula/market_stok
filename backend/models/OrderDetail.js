import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const OrderDetail = sequelize.define('OrderDetail', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    //SİPARİŞ BAĞLANTISI (F.K)
    order_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: 'Orders',
            key: 'id'
        },
        onDelete: 'CASCADE', // Ana sipariş silinirse detayları da silinsin
        onUpdate: 'CASCADE'
    },

    //ÜRÜN BAĞLANTISI (F.K)
    product_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: 'Products',
            key: 'id'
        },
        onDelete: 'RESTRICT', // Satılmış bir ürün silinemez
        onUpdate: 'CASCADE'
    },

    quantity: { type: DataTypes.INTEGER, allowNull: false },
    unit_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, { tableName: 'OrderDetails', timestamps: false });

export default OrderDetail;