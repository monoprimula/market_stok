import CategoryService from "../services/categoryService.js";

class CategoryController {
  //GET /api/categories

  static async getAll(req, res) {
    try {
      const categories = await CategoryService.getAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const category = await CategoryService.getCategoryById(req.params.id);
      
      if (!category) {
  
        return res.status(404).json({ error: "Kategori bulunamadı." });
      }

      res.status(200).json(category);
    } catch (error) {
     
      res.status(400).json({ error: error.message });
    }
  }

  //POST /api/categories
  static async create(req, res) {
    try {
      const newCategory = await CategoryService.createCategory(req.body);
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  //PUT /api/categories/:id
  static async update(req,res){
    try{
        const result = await CategoryService.updateCategory(req.params.id, req.body);
        res.status(200).json(result);  
    }catch(error){
       const status = error.message.includes('bulunamadı') ? 404 : 400;
        res.status(status).json({error: error.message});
    }
  }

  //DELETE /api/categories/:id
  static async delete(req,res){
    try{
        const result= await CategoryService.deleteCategory(req.params.id);
        res.status(200).json(result);
    }catch(error){
        const status = error.message.includes('bulunamadı') ? 404 : 400;
        res.status(status).json({error: error.message});
    }
  }
}

export default CategoryController;
