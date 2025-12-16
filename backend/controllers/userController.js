import UserService from '../services/userService.js'

class UserController {

    //GET /api/users
    static async listUser(req,res){
        try{
            const users= await UserService.getAllUsers();
            res.status(200).json(users);
        }catch(error){
            res.status(500).json({message:"Kullanıcı listesi alınamadı" + error.message});
        }
    }

    //PUT /api/users/:id/role
   static async updateUserRole(req, res) {
    const userId = req.params.id;
    const { role_id } = req.body; 

   
    if (role_id === undefined || role_id === null) {
        return res.status(400).json({ error: 'Rol ID zorunlu bir alandır.' });
    }
    
   
    if (isNaN(parseInt(role_id))) {
        return res.status(400).json({ error: 'Rol ID geçerli bir sayı olmalıdır.' });
    }

    try {
    
        const updatedUser = await UserService.updateUserRole(userId, role_id); 

        if (!updatedUser) {
             return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
        }
        
        return res.status(200).json({ success: true, user: updatedUser });

    } catch (error) {
        console.error("Kullanıcı rolü güncellenirken hata:", error);
    
        return res.status(500).json({ error: 'Rol güncelleme işlemi başarısız oldu.' });
    }
}

    //DELETE /api/users/:id
    static async deleteUser(req,res){
        try{
            const result= await UserService.deleteUser(req.params.id);
            res.status(200).json(result);
        }catch(error){
            res.status(400).json({message:error.message})
        }
    }
}
export default UserController