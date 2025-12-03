import db from '../models/index.js'

const {Category}= db;

class CategoryService{

    static async getAllCategories(){
        return await Category.findAll({
            order: [['name', 'ASC']] //alfabetik olarak getirir
        });
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
        const { name } = data;
        
        const [updatedRows] = await Category.update(
            { name }, 
            { where: { id } }
        );

        if (updatedRows === 0) {
            throw new Error('Güncellenecek kategori bulunamadı.');
        }

        const category = await Category.findByPk(id); 
        return { 
            category, 
            message: 'Kategori başarıyla güncellendi.' 
        };
    }

    //kategori silme
    static async deleteCategory(id){
        const category= Category.findByPk(id);

        if(!category){
            throw new Error('Kategori bulunamadı');
        }
        (await category).destroy();
        return {message:"Kategori başarıyla silindi"}
    }
}

export default CategoryService;