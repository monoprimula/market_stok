import { authService } from '../services/authService.js';
import { router } from '../router.js';
import { showToast } from '../components/toast.js';

export function renderLogin(container) {
    container.innerHTML = `
        <div class="auth-container">
            <div class="auth-card">
                <div class="auth-header">
                    <h1>Market Stok Sistemi</h1>
                    <p>Giriş Yap</p>
                </div>
                <form id="loginForm" class="auth-form">
                    <div class="form-group">
                        <label for="email">E-posta</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Şifre</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <div id="errorMessage" class="error-message"></div>
                    <button type="submit" class="btn btn-primary btn-block">Giriş Yap</button>
                </form>
                <div class="auth-footer">
                    <p>Hesabınız yok mu? <a href="#/register">Kayıt Ol</a></p>
                </div>
            </div>
        </div>
    `;

    const form = container.querySelector('#loginForm');
    const errorMessage = container.querySelector('#errorMessage');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        errorMessage.textContent = '';

        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');

        const result = authService.login(email, password);

        if (result.success) {
            const roleRoutes = {
                admin: '/admin',
                staff: '/staff',
                user: '/user'
            };
            showToast('Giriş başarılı!', 'success');
            router.navigate(roleRoutes[result.user.role]);
        } else {
            errorMessage.textContent = result.message;
            showToast(result.message, 'error');
        }
    });
}
