/**

 * @param {Array<string>} allowedRoles
 */
const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        // req.user objesi bir önceki (verifyToken) middleware'den geliyor
        const userRole = req.user?.role;
        
        if (!userRole) {
            return res.status(401).json({ message: "Yetki bilgisi (Rol) bulunamadı." });
        }

        // Kullanıcının rolü izin verilenler listesinde var mı
        if (allowedRoles.includes(userRole)) {
            next(); 
        } else {
            return res.status(403).json({ message: "Bu işlem için yetkiniz yok." });
        }
    };
};

export default checkRole;