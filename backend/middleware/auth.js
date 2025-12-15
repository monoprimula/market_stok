
import jwt from 'jsonwebtoken';
import db from '../models/index.js'; 
import process from 'process';
const { User, Role } = db; 

const verifyToken = async (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Erişim Reddedildi: Token bulunamadı." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
     
        const user = await User.findByPk(decoded.id, {
            include: [{ model: Role, as: 'role' }] 
        });

        if (!user) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı." });
        }
        
      
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role ? user.role.role_name : null 
        };

        next(); 
    } catch (error) {
        return res.status(403).json({message: "Token geçersiz veya süresi dolmuş." });
    }
};

export default verifyToken;