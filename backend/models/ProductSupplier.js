import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const ProductSupplier = sequelize.define('ProductSupplier', {
    // ÜRÜN BAĞLANTISI (F.K)
    product_id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true,
        references: {
            model: 'Products',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    // TEDARİKÇİ BAĞLANTISI (F.K)
    supplier_id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true,
        references: {
            model: 'Suppliers',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }
}, { tableName: 'ProductSuppliers', timestamps: false });

export default ProductSupplier;