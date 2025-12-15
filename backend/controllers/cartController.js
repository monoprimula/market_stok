import CartService from "../services/cartService.js";

class CartController {
  // GET /api/cart
  static async getCart(req, res) {
    try {
      const userId = req.user.id;

      const cartItems = await CartService.getCart(userId);
      res.status(200).json(cartItems);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /api/cart
  static async addToCart(req, res) {
    try {
      const userId = req.user.id;
      const { product_id, quantity } = req.body;
      const result = await CartService.addToCart(userId, product_id, quantity);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // DELETE /api/cart/:productId
  static async removeFromCart(req, res) {
    try {
      const userId = req.user.id;
      const { productId } = req.params; 

      const result = await CartService.removeFromCart(userId, productId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // PUT /api/cart
  static async updateQuantity(req, res) {
    try {
      const userId = req.user.id;
      const { product_id, quantity } = req.body;

      const result = await CartService.updateQuantity(
        userId,
        product_id,
        quantity
      );
      res.status(200).json(result);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // DELETE /api/cart (Tümünü sil)
  static async clearCart(req, res) {
    try {
      const userId = req.user.id;
      const result = await CartService.clearCart(userId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async confirmCart(req, res) {
    try {
      const userId = req.user.id;
      const result = await CartService.confirmCart(userId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default CartController;
