import { authService } from '../services/authService.js';
import { productService } from '../services/productService.js';
import { categoryService } from '../services/categoryService.js';
import { logService } from '../services/logService.js';
import { createNavbar } from '../components/navbar.js';
import { showConfirmModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';

export function renderAdminDashboard(container) {
    const user = authService.getCurrentUser();

    if (!document.querySelector('link[href="/styles/adminDashboard.css"]')) {
        const l = document.createElement('link');
        l.rel = 'stylesheet';
        l.href = '/styles/adminDashboard.css';
        document.head.appendChild(l);
    }

    if (!user || user.role !== 'admin') {
        window.location.hash = '#/login';
        return;
    }

    container.className = 'admin-theme';
    container.appendChild(createNavbar(user));

    const dashboard = document.createElement('div');
    dashboard.className = 'dashboard';

    dashboard.innerHTML = `
        <div class="dashboard-header">
            <h1>Yönetici Paneli</h1>
        </div>
        <div class="dashboard-tabs">
            <button class="tab-btn active" data-tab="products">Ürünler</button>
            <button class="tab-btn" data-tab="categories">Kategoriler</button>
            <button class="tab-btn" data-tab="users">Kullanıcılar</button>
            <button class="tab-btn" data-tab="reports">Raporlar</button>
            <button class="tab-btn" data-tab="logs">İşlem Geçmişi</button>
        </div>
        <div id="tabContent" class="tab-content"></div>
    `;

    container.appendChild(dashboard);

    const tabs = dashboard.querySelectorAll('.tab-btn');
    const tabContent = dashboard.querySelector('#tabContent');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderTabContent(tabContent, tab.dataset.tab);
        });
    });

    renderTabContent(tabContent, 'products');
}

function renderTabContent(container, tabName) {
    container.innerHTML = '';
    const user = authService.getCurrentUser();

    switch(tabName) {
        case 'products':
            renderProductsTab(container, user);
            break;
        case 'categories':
            renderCategoriesTab(container, user);
            break;
        case 'users':
            renderUsersTab(container);
            break;
        case 'reports':
            renderReportsTab(container);
            break;
        case 'logs':
            renderLogsTab(container);
            break;
    }
}

function renderProductsTab(container, user) {
    const products = productService.getAll();
    const categories = categoryService.getAll();

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div class="tab-header">
            <div>
                <h2>Ürün Yönetimi</h2>
                <p class="tab-subtitle">${products.length} ürün kayıtlı</p>
            </div>
            <button class="btn btn-primary" id="addProductBtn">+ Yeni Ürün</button>
        </div>
        <div class="filters">
            <input type="text" id="searchInput" class="search-input" placeholder="Ürün ara (ad veya barkod)...">
            <select id="categoryFilter" class="filter-select">
                <option value="">Tüm Kategoriler</option>
                ${categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('')}
            </select>
        </div>
        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Ürün Adı</th>
                        <th>Barkod</th>
                        <th>Kategori</th>
                        <th>Fiyat</th>
                        <th>Stok</th>
                        <th>İşlemler</th>
                    </tr>
                </thead>
                <tbody id="productsTableBody"></tbody>
            </table>
        </div>
    `;
    container.appendChild(wrapper);

    const searchInput = wrapper.querySelector('#searchInput');
    const categoryFilter = wrapper.querySelector('#categoryFilter');
    const tbody = wrapper.querySelector('#productsTableBody');

    function updateProductsTable() {
        const searchQuery = searchInput.value;
        const categoryId = categoryFilter.value;
        const filtered = productService.search(searchQuery, categoryId);

        tbody.innerHTML = filtered.map(product => {
            const category = categories.find(c => c.id === product.categoryId);
            return `
                <tr>
                    <td><strong>${product.name}</strong></td>
                    <td><code>${product.barcode}</code></td>
                    <td>${category ? category.name : 'Bilinmiyor'}</td>
                    <td>${product.price.toFixed(2)} ₺</td>
                    <td><span class="badge ${product.stock < 10 ? 'badge-danger' : 'badge-success'}">${product.stock}</span></td>
                    <td>
                        <button class="btn btn-sm btn-secondary" data-edit="${product.id}">Düzenle</button>
                        <button class="btn btn-sm btn-danger" data-delete="${product.id}">Sil</button>
                    </td>
                </tr>
            `;
        }).join('') || '<tr><td colspan="6" class="text-center">Ürün bulunamadı</td></tr>';

        tbody.querySelectorAll('[data-edit]').forEach(btn => {
            btn.addEventListener('click', () => showProductForm(btn.dataset.edit, user));
        });

        tbody.querySelectorAll('[data-delete]').forEach(btn => {
            btn.addEventListener('click', () => {
                const product = products.find(p => p.id === btn.dataset.delete);
                showConfirmModal(`"${product.name}" ürününü silmek istediğinizden emin misiniz?`, () => {
                    productService.delete(btn.dataset.delete);
                    logService.add('Ürün Silindi', `${product.name} (${product.barcode})`, user.id, user.role);
                    showToast('Ürün başarıyla silindi', 'success');
                    updateProductsTable();
                });
            });
        });
    }

    searchInput.addEventListener('input', updateProductsTable);
    categoryFilter.addEventListener('change', updateProductsTable);
    wrapper.querySelector('#addProductBtn').addEventListener('click', () => showProductForm(null, user));

    updateProductsTable();
}

function showProductForm(productId, user) {
    const product = productId ? productService.getById(productId) : null;
    const categories = categoryService.getAll();

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>${product ? 'Ürün Düzenle' : 'Yeni Ürün'}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <form id="productForm" class="modal-form">
                    <div class="form-group">
                        <label for="name">Ürün Adı *</label>
                        <input type="text" id="name" name="name" value="${product?.name || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="barcode">Barkod *</label>
                        <input type="text" id="barcode" name="barcode" value="${product?.barcode || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="categoryId">Kategori *</label>
                        <select id="categoryId" name="categoryId" required>
                            <option value="">Seçiniz</option>
                            ${categories.map(cat => `
                                <option value="${cat.id}" ${product?.categoryId === cat.id ? 'selected' : ''}>
                                    ${cat.name}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="price">Fiyat (₺) *</label>
                        <input type="number" id="price" name="price" step="0.01" min="0" value="${product?.price || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="stock">Stok *</label>
                        <input type="number" id="stock" name="stock" min="0" value="${product?.stock || ''}" required>
                    </div>
                    <div id="formErrors" class="error-message"></div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" id="cancelBtn">İptal</button>
                        <button type="submit" class="btn btn-primary">Kaydet</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const form = modal.querySelector('#productForm');
    const formErrors = modal.querySelector('#formErrors');
    const closeModal = () => modal.remove();

    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
    modal.querySelector('#cancelBtn').addEventListener('click', closeModal);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        formErrors.textContent = '';

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        let result;
        if (productId) {
            result = productService.update(productId, data);
            if (result.success) {
                logService.add('Ürün Güncellendi', `${data.name} (${data.barcode})`, user.id, user.role);
                showToast('Ürün başarıyla güncellendi', 'success');
            }
        } else {
            result = productService.create(data, user.id);
            if (result.success) {
                logService.add('Ürün Eklendi', `${data.name} (${data.barcode})`, user.id, user.role);
                showToast('Ürün başarıyla eklendi', 'success');
            }
        }

        if (result.success) {
            closeModal();
            renderTabContent(document.querySelector('#tabContent'), 'products');
        } else {
            formErrors.textContent = result.errors.join(', ');
            showToast(result.errors[0], 'error');
        }
    });
}

function renderCategoriesTab(container, user) {
    const categories = categoryService.getAll();

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div class="tab-header">
            <div>
                <h2>Kategori Yönetimi</h2>
                <p class="tab-subtitle">${categories.length} kategori kayıtlı</p>
            </div>
            <button class="btn btn-primary" id="addCategoryBtn">+ Yeni Kategori</button>
        </div>
        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Kategori Adı</th>
                        <th>Açıklama</th>
                        <th>Oluşturma Tarihi</th>
                        <th>İşlemler</th>
                    </tr>
                </thead>
                <tbody id="categoriesTableBody"></tbody>
            </table>
        </div>
    `;
    container.appendChild(wrapper);

    const tbody = wrapper.querySelector('#categoriesTableBody');

    function updateCategoriesTable() {
        const categories = categoryService.getAll();
        tbody.innerHTML = categories.map(cat => `
            <tr>
                <td><strong>${cat.name}</strong></td>
                <td>${cat.description || '-'}</td>
                <td>${new Date(cat.createdAt).toLocaleDateString('tr-TR')}</td>
                <td>
                    <button class="btn btn-sm btn-secondary" data-edit="${cat.id}">Düzenle</button>
                    <button class="btn btn-sm btn-danger" data-delete="${cat.id}">Sil</button>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="4" class="text-center">Kategori bulunamadı</td></tr>';

        tbody.querySelectorAll('[data-edit]').forEach(btn => {
            btn.addEventListener('click', () => showCategoryForm(btn.dataset.edit, user));
        });

        tbody.querySelectorAll('[data-delete]').forEach(btn => {
            btn.addEventListener('click', () => {
                const cat = categories.find(c => c.id === btn.dataset.delete);
                showConfirmModal(`"${cat.name}" kategorisini silmek istediğinizden emin misiniz?`, () => {
                    categoryService.delete(btn.dataset.delete);
                    logService.add('Kategori Silindi', cat.name, user.id, user.role);
                    showToast('Kategori başarıyla silindi', 'success');
                    updateCategoriesTable();
                });
            });
        });
    }

    wrapper.querySelector('#addCategoryBtn').addEventListener('click', () => showCategoryForm(null, user));
    updateCategoriesTable();
}

function showCategoryForm(categoryId, user) {
    const category = categoryId ? categoryService.getById(categoryId) : null;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>${category ? 'Kategori Düzenle' : 'Yeni Kategori'}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <form id="categoryForm" class="modal-form">
                    <div class="form-group">
                        <label for="name">Kategori Adı *</label>
                        <input type="text" id="name" name="name" value="${category?.name || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="description">Açıklama</label>
                        <textarea id="description" name="description" rows="3">${category?.description || ''}</textarea>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" id="cancelBtn">İptal</button>
                        <button type="submit" class="btn btn-primary">Kaydet</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const form = modal.querySelector('#categoryForm');
    const closeModal = () => modal.remove();

    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
    modal.querySelector('#cancelBtn').addEventListener('click', closeModal);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        if (categoryId) {
            categoryService.update(categoryId, data);
            logService.add('Kategori Güncellendi', data.name, user.id, user.role);
            showToast('Kategori başarıyla güncellendi', 'success');
        } else {
            categoryService.create(data);
            logService.add('Kategori Eklendi', data.name, user.id, user.role);
            showToast('Kategori başarıyla eklendi', 'success');
        }

        closeModal();
        renderTabContent(document.querySelector('#tabContent'), 'categories');
    });
}

function renderUsersTab(container) {
    const users = authService.getAllUsers();
    const currentUser = authService.getCurrentUser();

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div class="tab-header">
            <div>
                <h2>Kullanıcı Yönetimi</h2>
                <p class="tab-subtitle">${users.length} kullanıcı kayıtlı</p>
            </div>
        </div>
        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Ad Soyad</th>
                        <th>E-posta</th>
                        <th>Rol</th>
                        <th>Kayıt Tarihi</th>
                        <th>İşlemler</th>
                    </tr>
                </thead>
                <tbody id="usersTableBody"></tbody>
            </table>
        </div>
    `;
    container.appendChild(wrapper);

    const tbody = wrapper.querySelector('#usersTableBody');

    function updateUsersTable() {
        const users = authService.getAllUsers();
        const roleNames = { admin: 'Yönetici', staff: 'Personel', user: 'Kullanıcı' };

        tbody.innerHTML = users.map(u => `
            <tr>
                <td><strong>${u.name}</strong> ${u.id === currentUser.id ? '<span class="badge badge-info">Siz</span>' : ''}</td>
                <td>${u.email}</td>
                <td>
                    <select class="role-select" data-user-id="${u.id}" ${u.id === currentUser.id ? 'disabled' : ''}>
                        <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Yönetici</option>
                        <option value="staff" ${u.role === 'staff' ? 'selected' : ''}>Personel</option>
                        <option value="user" ${u.role === 'user' ? 'selected' : ''}>Kullanıcı</option>
                    </select>
                </td>
                <td>${new Date(u.createdAt).toLocaleDateString('tr-TR')}</td>
                <td>
                    ${u.id !== currentUser.id ? `<button class="btn btn-sm btn-danger" data-delete="${u.id}">Sil</button>` : '-'}
                </td>
            </tr>
        `).join('');

        tbody.querySelectorAll('.role-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const userId = e.target.dataset.userId;
                const newRole = e.target.value;
                const user = users.find(u => u.id === userId);

                authService.updateUserRole(userId, newRole);
                logService.add('Kullanıcı Rolü Güncellendi', `${user.email} -> ${newRole}`, currentUser.id, currentUser.role);
                showToast('Kullanıcı rolü güncellendi', 'success');
            });
        });

        tbody.querySelectorAll('[data-delete]').forEach(btn => {
            btn.addEventListener('click', () => {
                const user = users.find(u => u.id === btn.dataset.delete);
                showConfirmModal(`"${user.name}" kullanıcısını silmek istediğinizden emin misiniz?`, () => {
                    authService.deleteUser(btn.dataset.delete);
                    logService.add('Kullanıcı Silindi', user.email, currentUser.id, currentUser.role);
                    showToast('Kullanıcı başarıyla silindi', 'success');
                    updateUsersTable();
                });
            });
        });
    }

    updateUsersTable();
}

function renderReportsTab(container) {
    const products = productService.getAll();
    const categories = categoryService.getAll();
    const users = authService.getAllUsers();

    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const lowStock = products.filter(p => p.stock < 10).length;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div class="tab-header">
            <h2>Raporlar ve İstatistikler</h2>
            <button class="btn btn-primary" id="exportReportBtn">📊 CSV Olarak İndir</button>
        </div>
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Toplam Ürün</h3>
                <p class="stat-value">${products.length}</p>
            </div>
            <div class="stat-card">
                <h3>Toplam Stok</h3>
                <p class="stat-value">${totalStock}</p>
            </div>
            <div class="stat-card">
                <h3>Stok Değeri</h3>
                <p class="stat-value">${totalValue.toFixed(2)} ₺</p>
            </div>
            <div class="stat-card alert">
                <h3>Düşük Stok</h3>
                <p class="stat-value">${lowStock}</p>
            </div>
            <div class="stat-card">
                <h3>Kategori Sayısı</h3>
                <p class="stat-value">${categories.length}</p>
            </div>
            <div class="stat-card">
                <h3>Kullanıcı Sayısı</h3>
                <p class="stat-value">${users.length}</p>
            </div>
        </div>
        <div class="report-section">
            <h3>Düşük Stok Uyarıları</h3>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Ürün</th>
                            <th>Kategori</th>
                            <th>Mevcut Stok</th>
                            <th>Fiyat</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${products.filter(p => p.stock < 10).map(p => {
                            const cat = categories.find(c => c.id === p.categoryId);
                            return `
                                <tr>
                                    <td>${p.name}</td>
                                    <td>${cat ? cat.name : 'Bilinmiyor'}</td>
                                    <td><span class="badge badge-danger">${p.stock}</span></td>
                                    <td>${p.price.toFixed(2)} ₺</td>
                                </tr>
                            `;
                        }).join('') || '<tr><td colspan="4" class="text-center">Düşük stoklu ürün yok</td></tr>'}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    container.appendChild(wrapper);

    wrapper.querySelector('#exportReportBtn').addEventListener('click', () => {
        productService.exportToCSV();
        showToast('Rapor başarıyla indirildi', 'success');
    });
}

function renderLogsTab(container) {
    const logs = logService.getAll();

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div class="tab-header">
            <div>
                <h2>İşlem Geçmişi</h2>
                <p class="tab-subtitle">${logs.length} işlem kaydı</p>
            </div>
            <div>
                <button class="btn btn-secondary" id="clearLogsBtn">Geçmişi Temizle</button>
                <button class="btn btn-primary" id="exportLogsBtn">📄 CSV İndir</button>
            </div>
        </div>
        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Tarih & Saat</th>
                        <th>İşlem</th>
                        <th>Detay</th>
                        <th>Kullanıcı Rolü</th>
                    </tr>
                </thead>
                <tbody>
                    ${logs.map(log => `
                        <tr>
                            <td>${new Date(log.timestamp).toLocaleString('tr-TR')}</td>
                            <td><span class="badge badge-info">${log.action}</span></td>
                            <td>${log.details}</td>
                            <td>${log.userRole}</td>
                        </tr>
                    `).join('') || '<tr><td colspan="4" class="text-center">İşlem kaydı yok</td></tr>'}
                </tbody>
            </table>
        </div>
    `;
    container.appendChild(wrapper);

    wrapper.querySelector('#exportLogsBtn').addEventListener('click', () => {
        logService.exportToCSV();
        showToast('İşlem geçmişi başarıyla indirildi', 'success');
    });

    wrapper.querySelector('#clearLogsBtn').addEventListener('click', () => {
        showConfirmModal('Tüm işlem geçmişini silmek istediğinizden emin misiniz?', () => {
            logService.clear();
            showToast('İşlem geçmişi temizlendi', 'success');
            renderTabContent(container.parentElement, 'logs');
        });
    });
}
