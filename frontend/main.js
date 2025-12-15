import { router } from './router.js';
import { initializeMockData } from './services/mockData.js';

const app = document.getElementById('app');

function initApp() {
    initializeMockData();

    router.init(app);
}

window.addEventListener('hashchange', () => {
    router.init(app);
});

window.addEventListener('DOMContentLoaded', initApp);
