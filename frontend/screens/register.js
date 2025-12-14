import { authService } from '../services/authService.js';
import { router } from '../router.js';
import { showToast } from '../components/toast.js';

export function renderRegister(container) {
    container.innerHTML = `
        <div class="auth-container">
            <div class="auth-card">
                <div class="auth-header">
                    <h1>Market Stok Sistemi</h1>
                    <p>Kayıt Ol</p>
                </div>
                <form id="registerForm" class="auth-form">
                    <div class="form-group">
                        <label for="name">Ad Soyad</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">E-posta</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Şifre</label>
                        <input type="password" id="password" name="password" required minlength="6">
                    </div>
                    <div class="form-group">
                        <label for="role">Rol</label>
                        <select id="role" name="role" required>
                            <option value="user">Kullanıcı</option>
                            <option value="staff">Personel</option>
                            <option value="admin">Yönetici</option>
                        </select>
                    </div>
                    <div id="errorMessage" class="error-message"></div>
                    <button type="submit" class="btn btn-primary btn-block">Kayıt Ol</button>
                </form>
                <div class="auth-footer">
                    <p>Hesabınız var mı? <a href="#/login">Giriş Yap</a></p>
                </div>
            </div>
        </div>
    `;

    const form = container.querySelector('#registerForm');
    const errorMessage = container.querySelector('#errorMessage');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        errorMessage.textContent = '';

        const formData = new FormData(form);
        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            role: formData.get('role')
        };

        const result = authService.register(userData);

        if (result.success) {
            showToast('Kayıt başarılı! Giriş yapabilirsiniz.', 'success');
            router.navigate('/login');
        } else {
            errorMessage.textContent = result.message;
            showToast(result.message, 'error');
        }
    });
}
