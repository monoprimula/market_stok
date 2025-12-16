import db from '../models/index.js'

const {User, Role}=db;

class UserService{
    //tüm kullanıcıları listele
    static async getAllUsers(){
        return await User.findAll({
            attributes: {exclude: ['password_hash']},
            include: [{ 
                model: Role,
                as: 'role' 
            }]
        });
    }

    //kullanıcının rolünü güncelleme
    static async updateUserRole(userId, newRoleId){
        const user = await User.findByPk(userId);
        if(!user){
            throw new Error('Kullanıcı bulunamadı');
        }
        const role = await Role.findByPk(newRoleId);
        if(!role){
            throw new Error('Verilmek istenen rol bulunamadı.');
        }
        
        const [updatedRows]= await User.update(
            {role_id:newRoleId},
            {where:{id:userId}}
        );

        if (updatedRows === 0) {
            throw new Error('Kullanıcı rolü güncellenemedi.');
        }

        return { 
            message: `Kullanıcı rolü başarıyla ${role.role_name} olarak güncellendi.`, 
            user_id: userId 
        };
    }

    //kullanıcıyı sil
    static async deleteUser(userId){
        const deletedRows = await User.destroy({ where: { id: userId } });

        if (deletedRows === 0) {
            throw new Error('Kullanıcı bulunamadı veya silinemedi (Örn: Bağlı siparişleri olabilir).');
        }

        return { message: 'Kullanıcı başarıyla silindi.' };
    }

}

export default UserService;