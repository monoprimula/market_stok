/**

 * @param {Array<string>} allowedRoles
 */
const checkRole = (allowedRoles) => {
    return (req, res, next) => {
    console.log('Kullanıcı Rolü:', req.user.role); 
    console.log('İzin Verilen Roller:', allowedRoles);
        const userRole = req.user?.role;
        
        if (!userRole) {
            return res.status(401).json({ message: "Yetki bilgisi (Rol) bulunamadı." });
        }

       
        if (allowedRoles.includes(userRole)) {
            next(); 
        } else {
            return res.status(403).json({ message: "Bu işlem için yetkiniz yok." });
        }
    };
};

export default checkRole;