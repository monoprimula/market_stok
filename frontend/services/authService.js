export const authService = {
    login(email, password) {
        if (!email || !password) {
            return { success: false, message: 'E-posta ve şifre alanları zorunludur' };
        }

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            const sessionUser = { id: user.id, name: user.name, email: user.email, role: user.role };
            localStorage.setItem('currentUser', JSON.stringify(sessionUser));
            return { success: true, user: sessionUser };
        }

        return { success: false, message: 'Kullanıcı adı veya şifre hatalı' };
    },

    register(userData) {
        if (!userData.name || !userData.email || !userData.password) {
            return { success: false, message: 'Tüm alanlar zorunludur' };
        }

        if (!this.validateEmail(userData.email)) {
            return { success: false, message: 'Geçerli bir e-posta adresi giriniz' };
        }

        if (userData.password.length < 6) {
            return { success: false, message: 'Şifre en az 6 karakter olmalıdır' };
        }

        const users = JSON.parse(localStorage.getItem('users') || '[]');

        const existingUser = users.find(u => u.email === userData.email);
        if (existingUser) {
            return { success: false, message: 'Bu e-posta adresi zaten kayıtlı' };
        }

        const newUser = {
            id: Date.now().toString(),
            ...userData,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        return { success: true, user: newUser };
    },

    logout() {
        localStorage.removeItem('currentUser');
        window.location.hash = '#/login';
    },

    getCurrentUser() {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    },

    hasRole(role) {
        const user = this.getCurrentUser();
        return user && user.role === role;
    },

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    getAllUsers() {
        return JSON.parse(localStorage.getItem('users') || '[]');
    },

    updateUserRole(userId, newRole) {
        const users = this.getAllUsers();
        const user = users.find(u => u.id === userId);
        if (user) {
            user.role = newRole;
            localStorage.setItem('users', JSON.stringify(users));
            return { success: true, user };
        }
        return { success: false, message: 'Kullanıcı bulunamadı' };
    },

    deleteUser(userId) {
        const users = this.getAllUsers();
        const filtered = users.filter(u => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(filtered));
        return { success: true };
    }
};
