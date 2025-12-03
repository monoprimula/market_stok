import jwt from 'jsonwebtoken';
import db from '../models/index.js'; 
import process from 'process';

const { User, Role } = db;

const verifyToken = async (req, res, next) => {
    // 1. Token'ı Header'dan al (Format: "Bearer <token>")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Erişim Reddedildi: Token bulunamadı." });
    }

    try {
        // 2. Token geçerli mi
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Kullanıcı veritabanında var mı ve istenen role sahip mi
        const user = await User.findByPk(decoded.id, {
            include: [{ model: Role, as: 'role' }]
        });
        
        if (!user) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı." });
        }
        
        // 4. Kullanıcı bilgilerini req içine koy 
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