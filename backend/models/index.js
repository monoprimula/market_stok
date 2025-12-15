import { sequelize } from '../config/database.js';


import Role from './Role.js';
import User from './User.js';
import Category from './Category.js';
import Product from './Product.js';
import Order from './Order.js';
import OrderDetail from './OrderDetail.js';
import StockTransaction from './StockTransaction.js';
import Favorite from './Favorite.js';
import Cart from './Cart.js';

// --- İLİŞKİ TANIMLARI (ASSOCIATIONS) ---

// 1. Rol ve Kullanıcı
Role.hasMany(User, { foreignKey: 'role_id', as: 'users' });
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });

// 2. Kategori ve Ürün 
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// 3. Ürünü Ekleyen Personel (1-N)

User.hasMany(Product, { foreignKey: 'created_by', as: 'added_products' });
Product.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// 4. Siparişler ve Kullanıcı (1-N)
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'customer' });

// 5. Sipariş ve Sipariş Detayları (1-N)
Order.hasMany(OrderDetail, { foreignKey: 'order_id', as: 'details' });
OrderDetail.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// 6. Sipariş Detayı ve Ürün (1-N)
// Sipariş detayı içindeki ürün bilgisine erişmek için.
Product.hasMany(OrderDetail, { foreignKey: 'product_id', as: 'order_items' });
OrderDetail.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// 7. Stok Hareketleri ve Ürün (1-N)
Product.hasMany(StockTransaction, { foreignKey: 'product_id', as: 'movements' });
StockTransaction.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// 8. Stok Hareketleri ve Personel (1-N)
User.hasMany(StockTransaction, { foreignKey: 'user_id', as: 'transactions' });
StockTransaction.belongsTo(User, { foreignKey: 'user_id', as: 'staff' });

//9. Kullanıcı ve Ürün Arasındaki İlişki (N-N)
User.belongsToMany(Product, { through: Favorite, foreignKey: 'user_id',  as: 'favorite_products' });
Product.belongsToMany(User, { through: Favorite, foreignKey: 'product_id', as: 'favorited_by' });

Favorite.belongsTo(Product, { foreignKey: 'product_id' });
Favorite.belongsTo(User, { foreignKey: 'user_id' });

User.belongsToMany(Product, { through: Cart, foreignKey: 'user_id', as: 'cart_items' });


Product.belongsToMany(User, { through: Cart, foreignKey: 'product_id', as: 'in_carts' });

Cart.belongsTo(Product, {
    foreignKey: 'product_id', 
    as: 'product'      
});
Cart.belongsTo(User, { foreignKey: 'user_id' });
Product.hasMany(Cart, {
    foreignKey: 'product_id'
});
User.hasMany(Cart, { foreignKey: 'user_id' });

const db = {
    sequelize,
    Role,
    User,
    Category,
    Product,
    Order,
    OrderDetail,
    StockTransaction,
    Favorite,
    Cart
};

export default db;