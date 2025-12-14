import { authService } from '../services/authService.js';

export function createNavbar(user) {
    const nav = document.createElement('nav');
    nav.className = 'navbar';

    const roleNames = {
        admin: 'Yönetici',
        staff: 'Personel',
        user: 'Kullanıcı'
    };

    nav.innerHTML = `
        <div class="navbar-container">
            <div class="navbar-brand">
                <h2>Market Stok Sistemi</h2>
            </div>
            <div class="navbar-menu">
                <span class="user-info">
                    ${roleNames[user.role]} - ${user.email}
                </span>
                <button class="btn btn-secondary" id="logoutBtn">Çıkış Yap</button>
            </div>
        </div>
    `;

    nav.querySelector('#logoutBtn').addEventListener('click', () => {
        authService.logout();
    });

    return nav;
}
