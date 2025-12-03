import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    
    // ROL BAĞLANTISI (F.K)
    role_id: { 
        type: DataTypes.INTEGER, 
        allowNull: true,
        references: {
            model: 'Roles', 
            key: 'id'       
        },
        onDelete: 'SET NULL', 
        onUpdate: 'CASCADE'
    },
    
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    password_hash: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'Users', timestamps: true, createdAt: 'created_at', updatedAt: false });

export default User;