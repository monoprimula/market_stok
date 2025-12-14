import { authService } from '../services/authService.js';
import { productService } from '../services/productService.js';
import { categoryService } from '../services/categoryService.js';
import { logService } from '../services/logService.js';
import { createNavbar } from '../components/navbar.js';
import { showConfirmModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';

export function renderStaffDashboard(container) {
    const user = authService.getCurrentUser();

    if (!document.querySelector('link[href="/styles/staffDashboard.css"]')) {
        const l = document.createElement('link');
        l.rel = 'stylesheet';
        l.href = '/styles/staffDashboard.css';
        document.head.appendChild(l);
    }

    if (!user || user.role !== 'staff') {
        window.location.hash = '#/login';
        return;
    }

    container.className = 'staff-theme';
    container.appendChild(createNavbar(user));

    const dashboard = document.createElement('div');
    dashboard.className = 'dashboard';

    dashboard.innerHTML = `
        <div class="dashboard-header">
            <h1>Personel Paneli</h1>
            <p>Ürün ekleme ve stok güncelleme işlemleri</p>
        </div>
        <div class="dashboard-tabs">
            <button class="tab-btn active" data-tab="myproducts">Ürünlerim</button>
            <button class="tab-btn" data-tab="allproducts">Tüm Ürünler</button>
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
            renderTabContent(tabContent, tab.dataset.tab, user);
        });
    });

    renderTabContent(tabContent, 'myproducts', user);
}

function renderTabContent(container, tabName, user) {
    container.innerHTML = '';

    switch(tabName) {
        case 'myproducts':
            renderMyProductsTab(container, user);
            break;
        case 'allproducts':
            renderAllProductsTab(container, user);
            break;
    }
}

function renderMyProductsTab(container, user) {
    const myProducts = productService.getByCreator(user.id);
    const categories = categoryService.getAll();

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div class="tab-header">
            <div>
                <h2>Benim Eklediğim Ürünler</h2>
                <p class="tab-subtitle">${myProducts.length} ürün</p>
            </div>
            <button class="btn btn-primary" id="addProductBtn">+ Yeni Ürün Ekle</button>
        </div>
        <div class="filters">
            <input type="text" id="searchInput" class="search-input" placeholder="Ürün ara...">
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
        let filtered = myProducts;

        if (searchQuery) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.barcode.includes(searchQuery)
            );
        }

        if (categoryId) {
            filtered = filtered.filter(p => p.categoryId === categoryId);
        }

        tbody.innerHTML = filtered.map(product => {
            const category = categories.find(c => c.id === product.categoryId);
            return `
                <tr>
                    <td><strong>${product.name}</strong></td>
                    <td><code>${product.barcode}</code></td>
                    <td>${category ? category.name : 'Bilinmiyor'}</td>
                    <td>${product.price.toFixed(2)} ₺</td>
                    <td>
                        <span class="badge ${product.stock < 10 ? 'badge-danger' : 'badge-success'}">
                            ${product.stock}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-secondary" data-edit="${product.id}">Düzenle</button>
                        <button class="btn btn-sm btn-info" data-stock="${product.id}">Stok Güncelle</button>
                    </td>
                </tr>
            `;
        }).join('') || '<tr><td colspan="6" class="text-center">Henüz ürün eklemediniz</td></tr>';

        tbody.querySelectorAll('[data-edit]').forEach(btn => {
            btn.addEventListener('click', () => showProductForm(btn.dataset.edit, user));
        });

        tbody.querySelectorAll('[data-stock]').forEach(btn => {
            btn.addEventListener('click', () => showStockUpdateForm(btn.dataset.stock, user));
        });
    }

    searchInput.addEventListener('input', updateProductsTable);
    categoryFilter.addEventListener('change', updateProductsTable);
    wrapper.querySelector('#addProductBtn').addEventListener('click', () => showProductForm(null, user));

    updateProductsTable();
}

function renderAllProductsTab(container, user) {
    const products = productService.getAll();
    const categories = categoryService.getAll();

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div class="tab-header">
            <div>
                <h2>Tüm Ürünler</h2>
                <p class="tab-subtitle">${products.length} ürün kayıtlı</p>
            </div>
        </div>
        <div class="filters">
            <input type="text" id="searchInput" class="search-input" placeholder="Ürün ara...">
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
                <tbody id="allProductsTableBody"></tbody>
            </table>
        </div>
    `;
    container.appendChild(wrapper);

    const searchInput = wrapper.querySelector('#searchInput');
    const categoryFilter = wrapper.querySelector('#categoryFilter');
    const tbody = wrapper.querySelector('#allProductsTableBody');

    function updateProductsTable() {
        const searchQuery = searchInput.value;
        const categoryId = categoryFilter.value;
        const filtered = productService.search(searchQuery, categoryId);

        tbody.innerHTML = filtered.map(product => {
            const category = categories.find(c => c.id === product.categoryId);
            const isMyProduct = product.createdBy === user.id;

            return `
                <tr>
                    <td>
                        <strong>${product.name}</strong>
                        ${isMyProduct ? '<span class="badge badge-info">Sizin</span>' : ''}
                    </td>
                    <td><code>${product.barcode}</code></td>
                    <td>${category ? category.name : 'Bilinmiyor'}</td>
                    <td>${product.price.toFixed(2)} ₺</td>
                    <td>
                        <span class="badge ${product.stock < 10 ? 'badge-danger' : 'badge-success'}">
                            ${product.stock}
                        </span>
                    </td>
                    <td>
                        ${isMyProduct ? `
                            <button class="btn btn-sm btn-secondary" data-edit="${product.id}">Düzenle</button>
                            <button class="btn btn-sm btn-info" data-stock="${product.id}">Stok</button>
                        ` : '<span class="text-muted">Görüntüleme</span>'}
                    </td>
                </tr>
            `;
        }).join('') || '<tr><td colspan="6" class="text-center">Ürün bulunamadı</td></tr>';

        tbody.querySelectorAll('[data-edit]').forEach(btn => {
            btn.addEventListener('click', () => showProductForm(btn.dataset.edit, user));
        });

        tbody.querySelectorAll('[data-stock]').forEach(btn => {
            btn.addEventListener('click', () => showStockUpdateForm(btn.dataset.stock, user));
        });
    }

    searchInput.addEventListener('input', updateProductsTable);
    categoryFilter.addEventListener('change', updateProductsTable);

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
                <h3>${product ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <form id="productForm" class="modal-form">
                    <div class="form-group">
                        <label for="name">Ürün Adı *</label>
                        <input type="text" id="name" name="name" value="${product?.name || ''}" required>
                        <small>Ürün adını giriniz</small>
                    </div>
                    <div class="form-group">
                        <label for="barcode">Barkod *</label>
                        <input type="text" id="barcode" name="barcode" value="${product?.barcode || ''}" required>
                        <small>Ürün barkod numarasını giriniz</small>
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
                        <small>Ürün kategorisini seçiniz</small>
                    </div>
                    <div class="form-group">
                        <label for="price">Fiyat (₺) *</label>
                        <input type="number" id="price" name="price" step="0.01" min="0" value="${product?.price || ''}" required>
                        <small>Sadece sayı girebilirsiniz (örn: 25.50)</small>
                    </div>
                    <div class="form-group">
                        <label for="stock">Stok Miktarı *</label>
                        <input type="number" id="stock" name="stock" min="0" value="${product?.stock || ''}" required>
                        <small>Stok miktarı boş bırakılamaz</small>
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
            renderTabContent(document.querySelector('#tabContent'), 'myproducts', user);
        } else {
            formErrors.textContent = result.errors.join(', ');
            showToast(result.errors[0], 'error');
        }
    });
}

function showStockUpdateForm(productId, user) {
    const product = productService.getById(productId);

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content modal-small">
            <div class="modal-header">
                <h3>Stok Güncelle</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="stock-info">
                    <h4>${product.name}</h4>
                    <p>Mevcut Stok: <strong>${product.stock}</strong></p>
                </div>
                <form id="stockForm" class="modal-form">
                    <div class="form-group">
                        <label for="newStock">Yeni Stok Miktarı *</label>
                        <input type="number" id="newStock" name="stock" min="0" value="${product.stock}" required>
                        <small>Güncel stok miktarını giriniz</small>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" id="cancelBtn">İptal</button>
                        <button type="submit" class="btn btn-primary">Güncelle</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const form = modal.querySelector('#stockForm');
    const closeModal = () => modal.remove();

    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
    modal.querySelector('#cancelBtn').addEventListener('click', closeModal);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const newStock = parseInt(formData.get('stock'));

        if (isNaN(newStock) || newStock < 0) {
            showToast('Geçerli bir stok miktarı giriniz', 'error');
            return;
        }

        const result = productService.update(productId, { ...product, stock: newStock });

        if (result.success) {
            logService.add('Stok Güncellendi', `${product.name}: ${product.stock} → ${newStock}`, user.id, user.role);
            showToast('Stok başarıyla güncellendi', 'success');
            closeModal();
            renderTabContent(document.querySelector('#tabContent'), 'myproducts', user);
        } else {
            showToast('Stok güncellenirken hata oluştu', 'error');
        }
    });
}
