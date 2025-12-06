import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Favorite = sequelize.define('Favorite', {
    user_id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true,
        references: { model: 'Users', key: 'id' }
    },
    product_id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true,
        references: { model: 'Products', key: 'id' }
    },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { 
    tableName: 'Favorites', 
    timestamps: false 
});

export default Favorite;