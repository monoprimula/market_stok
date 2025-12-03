import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Supplier = sequelize.define('Supplier', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    company_name: { type: DataTypes.STRING, allowNull: false },
    contact_name: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING }
}, { tableName: 'Suppliers', timestamps: false });

export default Supplier;