import db from "../models/index.js";
const { Cart, Product } = db;

class CartService {
  // Kullanıcının Sepetini Getir
  static async getCart(userId) {
    return await Cart.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "price", "stock_quantity"],
        },
      ],
    });
  }

  // Sepete Ürün Ekle
  static async addToCart(userId, product_id, quantity) {
    const qty = parseInt(quantity) || 1;

    const product = await Product.findByPk(product_id);
    if (!product) {
      throw new Error("Ürün bulunamadı");
    }
    if (product.stock_quantity < qty) {
      throw new Error("Yetersiz stok");
    }

    let cartItem = await Cart.findOne({
      where: { user_id: userId, product_id: product_id },
    });

    if (cartItem) {
      const newQuantity = cartItem.quantity + qty;
      if (newQuantity > product.stock_quantity) {
        throw new Error("Stok yetersiz (Sepettekiyle toplam)");
      }
      cartItem.quantity = newQuantity;
      await cartItem.save();
      return cartItem;
    } else {
      return await Cart.create({
        user_id: userId,
        product_id: product_id,
        quantity: qty,
      });
    }
  }

  // Sepetten Ürün Sil
  static async removeFromCart(userId, productId) {
        const result = await Cart.destroy({
            where: { user_id: userId, product_id: productId }
        });
        
        if (result === 0) throw new Error("Ürün bulunamadı veya zaten silinmiş.");
        return { message: "Ürün sepetten çıkarıldı." };
    }

    // Sepeti Temizle
    static async clearCart(userId) {
        await Cart.destroy({ where: { user_id: userId } });
        return { message: "Sepet temizlendi." };
    }

  // Miktar Güncelle
  static async updateQuantity(userId, productId, quantity) {
        if (quantity < 1) throw new Error('Miktar en az 1 olmalıdır');

        const cartItem = await Cart.findOne({
            where: { user_id: userId, product_id: productId }
        });

        if (!cartItem) throw new Error('Ürün sepette bulunamadı');

        const product = await Product.findByPk(productId);
        
        if (product.stock_quantity < quantity) {
            throw new Error(`Yetersiz stok! Mevcut stok: ${product.stock_quantity}`);
        }

        cartItem.quantity = quantity;
        await cartItem.save();
        return { message: "Miktar güncellendi" };
    }

    static async confirmCart(userId) {
        const cartItems = await Cart.findAll({
            where: { user_id: userId },
            include: [{ model: Product, as: 'product' }]
        });

        if (cartItems.length === 0) {
            throw new Error("Sepetiniz boş.");
        }

      
        for (const item of cartItems) {
            const product = item.product;
            
            if (!product) continue; 
            
            if (product.stock_quantity < item.quantity) {
                throw new Error(`${product.name} için yeterli stok yok. Stok: ${product.stock_quantity}`);
            }

            product.stock_quantity -= item.quantity;
            await product.save();
        }

        // Sepeti tamamen boşalt
        await Cart.destroy({ where: { user_id: userId } });

        return { success: true, message: "Siparişiniz onaylandı. Stoklar güncellendi." };
    }

}

export default CartService;
