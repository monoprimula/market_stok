import db from '../models/index.js'

const {Category}= db;

class CategoryService{

    static async getAllCategories(){
        return await Category.findAll({
            order: [['name', 'ASC']] //alfabetik olarak getirir
        });
    }

    static async getCategoryById(id) {
       
        const category = await Category.findByPk(id); 
        
        if (!category) {
            return null; 
        }

        return category;
    }
    //kategori oluşturuma
    static async createCategory(data){
        const {name}=data;

        const existing=await Category.findOne({where: {name}});

        if(existing){
            throw new Error('Bu kategori daha önce eklenmiş');
        }
        const newCategory = await Category.create({name});

         return {
            category: newCategory,
            message: 'Kategori başarıyla oluşturuldu'
        };}
    

    //kategori güncelleme
    static async updateCategory(id, data) {
        const { name} = data;
        
    
        const category = await Category.findByPk(id); 

        if (!category) {

            throw new Error('Güncellenecek kategori bulunamadı.'); 
        }

        // 2. Güncelleme
        const updatedCategory = await category.update({ name }); 

        return { 
            category: updatedCategory, 
            message: 'Kategori başarıyla güncellendi.' 
        };
    }

    //kategori silme
    static async deleteCategory(id) {
        const category = await Category.findByPk(id); 
        if (!category) {
            throw new Error("Kategori bulunamadı."); 
        }
        await category.destroy();
        return { message: "Kategori başarıyla silindi." };
    }
}

export default CategoryService;