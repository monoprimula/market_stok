import { Op } from "sequelize";
import db from "../models/index.js";

const { Product, Category, User } = db;

class ProductService {
  // 1. Yeni ürün ekleme
  static async createProduct(data, userId) {
    const {
      barcode_no,
      name,
      category_id,
      price,
      stock_quantity,
      description,
      image_url,
    } = data;

    const existing = await Product.findOne({ where: { barcode_no } });
    if (existing) {
      throw new Error("Bu barkod numarası zaten kayıtlı.");
    }

    const newProduct = await Product.create({
      barcode_no,
      name,
      category_id,
      price,
      stock_quantity,
      description,
      image_url,
      created_by: userId,
    });

    return newProduct;
  }

  // 2. Tüm Ürünleri Listeleme (Arama ve Filtreleme)
  static async getAllProducts(query) {
    const { search, category_id } = query;
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { barcode_no: { [Op.like]: `%${search}%` } },
      ];
    }

    if (category_id) {
      where.category_id = category_id;
    }

    return await Product.findAll({
      where,
      include: [
        { model: Category, as: "category" },
        { model: User, as: "creator", attributes: ["username"] },
      ],
      order: [["created_at", "DESC"]],
    });
  }

  // 3. Personelin sadece kendi eklediği  ürünleri listelemesi
  static async getStaffProducts(userId) {
        return await Product.findAll({
            where: {
                created_by: userId
            },
            include: [
                { model: Category, as: 'category', attributes: ['name'] },
                { model: User, as: 'creator', attributes: ['username', 'id'] }
            ],
            order: [['created_at', 'DESC']]
        });
    }

  // 4. Silme
  static async deleteProduct(id) {
    const product = await Product.findByPk(id);
    if (!product) throw new Error("Ürün bulunamadı.");
    await product.destroy();
    return { message: "Ürün başarıyla silindi." };
  }

  // 5. Güncelleme
  static async updateProduct(id, data) {
    const product = await Product.findByPk(id);
    if (!product) throw new Error("Ürün bulunamadı.");

    // Gelen data içinde image_url varsa o da güncellenir
    await product.update(data);
    return product;
  }
  // 6.Idsine göre ürün bulma
  static async getProductById(id) {
    const product = await Product.findByPk(id, {
      include: [
        { model: Category, as: "category" },
        { model: User, as: "creator", attributes: ["username"] },
      ],
    });

    if (!product) {
      throw new Error("Ürün bulunamadı.");
    }

    return product;
  }
}

export default ProductService;
