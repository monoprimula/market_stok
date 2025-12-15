import { router } from './router.js';


const app = document.getElementById('app');

function initApp() {

    router.init(app);
}

window.addEventListener('hashchange', () => {
    router.init(app);
});

window.addEventListener('DOMContentLoaded', initApp);
