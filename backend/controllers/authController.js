import AuthService from '../services/authService.js';
console.log("--- DEBUG: authController yüklendi ---");

class AuthController {

    // POST /api/auth/register
    static async register(req, res) {
        try {
            const userData = req.body;
            const newUser = await AuthService.register(userData);
            
            res.status(201).json({
                message: "Kayıt başarılı. Artık giriş yapabilirsiniz.",
                userId: newUser.id
            });
        } catch (error) {
            console.error("Kayıt Hatası:", error.message);
            res.status(400).json({ message: error.message });
        }
    }

    //POST /api/auth/login
    static async login(req,res){
        try{
            const {email, password}= req.body;
            const result = await AuthService.login(email,password);
            res.status(200).json({
                message: "Giriş başarılı.",
                token:result.token,
                user:result.user
            });
        }catch(error){
            console.error("Giriş Hatası:", error.message);
            res.status(401).json({ message: error.message });
        }
    }
}

export default AuthController;