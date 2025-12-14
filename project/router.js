import { renderLogin } from './screens/login.js';
import { renderRegister } from './screens/register.js';
import { renderAdminDashboard } from './screens/adminDashboard.js';
import { renderStaffDashboard } from './screens/staffDashboard.js';
import { renderUserDashboard } from './screens/userDashboard.js';
import { renderHome } from './screens/home.js';
import { authService } from './services/authService.js';

const routes = {
    '/home': renderHome,
    '/login': renderLogin,
    '/register': renderRegister,
    '/admin': renderAdminDashboard,
    '/staff': renderStaffDashboard,
    '/user': renderUserDashboard
};

export const router = {
    init(container) {
        const hash = window.location.hash.slice(1) || '/home';
        const route = routes[hash];

        if (route) {
            container.innerHTML = '';
            route(container);
        } else {
            container.innerHTML = '<h1>404 - Sayfa Bulunamadı</h1>';
        }
    },

    navigate(path) {
        window.location.hash = `#${path}`;
    }
};
