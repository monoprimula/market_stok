import { router } from './router.js';
import { authService } from './services/authService.js';
import { initializeMockData } from './services/mockData.js';

const app = document.getElementById('app');

function initApp() {
    initializeMockData();

    const currentUser = authService.getCurrentUser();

    if (!currentUser && !window.location.hash.includes('login') && !window.location.hash.includes('register')) {
        window.location.hash = '#/login';
    }

    router.init(app);
}

window.addEventListener('hashchange', () => {
    router.init(app);
});

window.addEventListener('DOMContentLoaded', initApp);
