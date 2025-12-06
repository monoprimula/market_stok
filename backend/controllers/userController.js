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
    static async updateUserRole(req,res){
        try{
            const userId= req.params.id;
            const {role_id}= req.body;
        
            if(req.user.id===userId){
                return res.status(403).json({message: "Kendi rolünüzü değiştiremezsiniz."});
            }
            const result = await UserService.updateUserRole(userId,role_id);
            res.status(200).json(result);
        }catch(error){
            res.status(400).json({ message: error.message });
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