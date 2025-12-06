import ProductService from '../services/productSerive.js'

class ProductController {

    // POST /api/products (Ürün Ekle)
    static async create(req, res) {
        try {
            // req.user.id auth middleware'den geliyor (Ekleyen kişi)
            const product = await ProductService.createProduct(req.body, req.user.id);
            res.status(201).json({ message: "Ürün eklendi.", product });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // GET /api/products (Tümünü Listele)
    static async getAll(req, res) {
        try {
            // req.query içinde ?search=kalem&category_id=2 gibi veriler gelir
            const products = await ProductService.getAllProducts(req.query);
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // GET /api/products/my-products (Sadece Personelin Ekledikleri)
    static async getMyProducts(req, res) {
        try {
            const products = await ProductService.getStaffProducts(req.user.id);
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // DELETE /api/products/:id
    static async delete(req, res) {
        try {
            const result = await ProductService.deleteProduct(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    
    // PUT /api/products/:id
    static async update(req, res) {
        try {
            const product = await ProductService.updateProduct(req.params.id, req.body);
            res.status(200).json({ message: "Ürün güncellendi.", product });
        } catch (error) {
             res.status(400).json({ message: error.message });
        }
    }
    // GET /api/products/:id
    static async getById(req, res) {
        try {
            const product = await ProductService.getProductById(req.params.id);
            res.status(200).json(product);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
}

export default ProductController;