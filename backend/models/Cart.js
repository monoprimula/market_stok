import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Cart = sequelize.define('Cart', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
}, {
    timestamps: true,
    tableName: 'carts',
    createdAt: 'created_at',
    updatedAt: false
});

export default Cart;