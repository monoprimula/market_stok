import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../models/index.js'; 
import process from 'process';

const {User, Role} =db;
const saltRounds=10;

class AuthService {

    // Kullanıcının kayıt olması (Register)
    static async register(userData){
        const {username, email,password, role_id}=userData;
        console.log("Gelen Şifre:", password);

        const existingUser=await User.findOne({where:{email}});
        if(existingUser){
            throw new Error("Bu e-posta adresi zaten kullanımda.");
        }

        
        //şifrenin hashlenmesi
        const password_hash=await bcrypt.hash(password,saltRounds);
        
        const newUser = await User.create({
            username,
            email,
            password_hash,
            role_id: role_id || 3,
        });
            return newUser;
            }

    static async login(email,password){
        const user=await User.findOne({
            where:{email},
            include: [{ model: Role, as: 'role' }]
        });
        if(!user){
            throw new Error("Kullanıcı bulunamadı.");
        }
        
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if(!isMatch){
            throw new Error("Geçersiz şifre.");
        }

        const tokenPayload = {
            id:user.id,
            role: user.role ? user.role.role_name : 'User',
        }

        const token = jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET,
            {expiresIn: '24h'}

        );

        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role ? user.role.role_name : 'User'
            }
        };
    };
}
export default AuthService;