import { authService } from '../services/authService.js';
import { productService } from '../services/productService.js';
import { categoryService } from '../services/categoryService.js';
import { favoriteService } from '../services/favoriteService.js';
import { cartService } from '../services/cartService.js';
import { createNavbar } from '../components/navbar.js';
import { showToast } from '../components/toast.js';

export function renderUserDashboard(container) {
    const user = authService.getCurrentUser();

    if (!document.querySelector('link[href="/styles/userDashboard.css"]')) {
        const l = document.createElement('link');
        l.rel = 'stylesheet';
        l.href = '/styles/userDashboard.css';
        document.head.appendChild(l);
    }

    if (!user || user.role !== 'user') {
        window.location.hash = '#/login';
        return;
    }

    container.className = 'user-theme';
    container.appendChild(createNavbar(user));

    const dashboard = document.createElement('div');
    dashboard.className = 'dashboard';

    dashboard.innerHTML = `
        <div class="dashboard-header">
            <div>
                <h1>Ürün Kataloğu</h1>
                <p>Tüm ürünleri görüntüleyin ve arayın</p>
            </div>
            <div class="header-actions">
                <button class="btn btn-secondary" id="viewFavoritesBtn">
                    ⭐ Favorilerim (<span id="favCount">0</span>)
                </button>
                <button class="btn btn-primary" id="viewCartBtn">
                    🛒 Sepetim (<span id="cartCount">0</span>)
                </button>
            </div>
        </div>
        <div class="filters">
            <input type="text" id="searchInput" class="search-input" placeholder="Ürün ara (ad veya barkod)...">
            <select id="categoryFilter" class="filter-select">
                <option value="">Tüm Kategoriler</option>
            </select>
        </div>
        <div id="productList" class="product-grid"></div>
    `;

    container.appendChild(dashboard);

    const searchInput = dashboard.querySelector('#searchInput');
    const categoryFilter = dashboard.querySelector('#categoryFilter');
    const productList = dashboard.querySelector('#productList');
    const favCount = dashboard.querySelector('#favCount');
    const cartCount = dashboard.querySelector('#cartCount');

    const categories = categoryService.getAll();
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        categoryFilter.appendChild(option);
    });

    function updateCounts() {
        const favorites = favoriteService.getAll(user.id);
        const cart = cartService.getAll(user.id);
        favCount.textContent = favorites.length;
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    function renderProducts() {
        const searchQuery = searchInput.value;
        const categoryId = categoryFilter.value;
        const products = productService.search(searchQuery, categoryId);
        const categories = categoryService.getAll();
        const favorites = favoriteService.getAll(user.id);

        if (products.length === 0) {
            productList.innerHTML = '<div class="empty-state"><p>Ürün bulunamadı</p></div>';
            return;
        }

        productList.innerHTML = products.map(product => {
            const category = categories.find(c => c.id === product.categoryId);
            const isFavorite = favorites.includes(product.id);

            return `
                <div class="product-card">
                    <div class="product-header">
                        <div>
                            <h3>${product.name}</h3>
                            <span class="badge badge-category">${category ? category.name : 'Diğer'}</span>
                        </div>
                        <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-product-id="${product.id}">
                            ${isFavorite ? '⭐' : '☆'}
                        </button>
                    </div>
                    <p class="product-barcode"><small>Barkod: ${product.barcode}</small></p>
                    <p class="product-price">${product.price.toFixed(2)} ₺</p>
                    <p class="product-stock ${product.stock < 10 ? 'low-stock' : ''}">
                        ${product.stock > 0 ? `Stok: ${product.stock}` : 'Stokta Yok'}
                    </p>
                    <div class="product-actions">
                        <button class="btn btn-sm btn-secondary" data-view="${product.id}">Detay</button>
                        <button class="btn btn-sm btn-primary" data-cart="${product.id}" ${product.stock === 0 ? 'disabled' : ''}>
                            🛒 Sepete Ekle
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        productList.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = btn.dataset.productId;
                const isFavorite = favoriteService.isFavorite(user.id, productId);

                if (isFavorite) {
                    favoriteService.remove(user.id, productId);
                    showToast('Favorilerden çıkarıldı', 'info');
                } else {
                    favoriteService.add(user.id, productId);
                    showToast('Favorilere eklendi', 'success');
                }

                updateCounts();
                renderProducts();
            });
        });

        productList.querySelectorAll('[data-view]').forEach(btn => {
            btn.addEventListener('click', () => {
                const product = products.find(p => p.id === btn.dataset.view);
                showProductDetail(product, user);
            });
        });

        productList.querySelectorAll('[data-cart]').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = btn.dataset.cart;
                const product = products.find(p => p.id === productId);
                const result = cartService.add(user.id, productId, 1);
                
                if (result.success) {
                    showToast(`${product.name} sepete eklendi`, 'success');
                    updateCounts();
                } else {
                    showToast(result.message, 'error');
                }
            });
        });
    }

    searchInput.addEventListener('input', renderProducts);
    categoryFilter.addEventListener('change', renderProducts);

    dashboard.querySelector('#viewFavoritesBtn').addEventListener('click', () => {
        showFavorites(user);
    });

    dashboard.querySelector('#viewCartBtn').addEventListener('click', () => {
        showCart(user);
    });

    updateCounts();
    renderProducts();
}

function showProductDetail(product, user) {
    const category = categoryService.getAll().find(c => c.id === product.categoryId);

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Ürün Detayı</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="product-detail">
                    <h2>${product.name}</h2>
                    <div class="detail-row">
                        <span class="label">Kategori:</span>
                        <span class="value">${category ? category.name : 'Bilinmiyor'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Barkod:</span>
                        <span class="value"><code>${product.barcode}</code></span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Fiyat:</span>
                        <span class="value price">${product.price.toFixed(2)} ₺</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Stok Durumu:</span>
                        <span class="value">
                            <span class="badge ${product.stock < 10 ? 'badge-danger' : 'badge-success'}">
                                ${product.stock > 0 ? `${product.stock} adet` : 'Stokta Yok'}
                            </span>
                        </span>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" id="closeBtn">Kapat</button>
                    <button class="btn btn-primary" id="addToCartBtn" ${product.stock === 0 ? 'disabled' : ''}>
                        🛒 Sepete Ekle
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const closeModal = () => modal.remove();
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
    modal.querySelector('#closeBtn').addEventListener('click', closeModal);

    modal.querySelector('#addToCartBtn').addEventListener('click', () => {
        const result = cartService.add(user.id, product.id, 1);
        
        if (result.success) {
            showToast(`${product.name} sepete eklendi`, 'success');
            closeModal();
            const cartCountEl = document.querySelector('#cartCount');
            if (cartCountEl) {
                const cart = cartService.getAll(user.id);
                cartCountEl.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
            }
        } else {
            showToast(result.message, 'error');
        }
    });
}

function showFavorites(user) {
    const favoriteIds = favoriteService.getAll(user.id);
    const allProducts = productService.getAll();
    const favorites = favoriteIds.map(id => allProducts.find(p => p.id === id)).filter(Boolean);
    const categories = categoryService.getAll();

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content modal-large">
            <div class="modal-header">
                <h3>⭐ Favorilerim (${favorites.length})</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                ${favorites.length === 0 ? '<p class="text-center">Henüz favori ürününüz yok</p>' : `
                    <div class="favorites-grid">
                        ${favorites.map(product => {
                            const category = categories.find(c => c.id === product.categoryId);
                            return `
                                <div class="favorite-item">
                                    <div>
                                        <h4>${product.name}</h4>
                                        <p class="small">${category ? category.name : 'Diğer'}</p>
                                        <p class="price">${product.price.toFixed(2)} ₺</p>
                                        <p class="small ${product.stock < 10 ? 'low-stock' : ''}">Stok: ${product.stock}</p>
                                    </div>
                                    <div class="item-actions">
                                        <button class="btn btn-sm btn-danger" data-remove="${product.id}">Çıkar</button>
                                        <button class="btn btn-sm btn-primary" data-cart="${product.id}" ${product.stock === 0 ? 'disabled' : ''}>
                                            Sepete Ekle
                                        </button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `}
                <div class="modal-actions">
                    <button class="btn btn-secondary" id="closeBtn">Kapat</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const closeModal = () => {
        modal.remove();
        const favCountEl = document.querySelector('#favCount');
        if (favCountEl) {
            favCountEl.textContent = favoriteService.getAll(user.id).length;
        }
    };

    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
    modal.querySelector('#closeBtn').addEventListener('click', closeModal);

    modal.querySelectorAll('[data-remove]').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = btn.dataset.remove;
            favoriteService.remove(user.id, productId);
            showToast('Favorilerden çıkarıldı', 'info');
            closeModal();
            showFavorites(user);
        });
    });

    modal.querySelectorAll('[data-cart]').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = btn.dataset.cart;
            const product = allProducts.find(p => p.id === productId);
            const result = cartService.add(user.id, productId, 1);
            
            if (result.success) {
                showToast(`${product.name} sepete eklendi`, 'success');
            } else {
                showToast(result.message, 'error');
            }
        });
    });
}

function showCart(user) {
    const cartItems = cartService.getAll(user.id);
    const allProducts = productService.getAll();
    const cart = cartItems.map(item => ({
        ...item,
        product: allProducts.find(p => p.id === item.productId)
    })).filter(item => item.product);

    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content modal-large">
            <div class="modal-header">
                <h3>🛒 Sepetim (${cart.length} ürün)</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                ${cart.length === 0 ? '<p class="text-center">Sepetiniz boş</p>' : `
                    <div class="cart-items">
                        ${cart.map(item => `
                            <div class="cart-item">
                                <div class="item-info">
                                    <h4>${item.product.name}</h4>
                                    <p class="small">Fiyat: ${item.product.price.toFixed(2)} ₺</p>
                                    <p class="small ${item.product.stock < 10 ? 'low-stock' : ''}">
                                        Mevcut Stok: ${item.product.stock}
                                    </p>
                                </div>
                                <div class="item-quantity">
                                    <button class="btn btn-sm btn-secondary" data-decrease="${item.productId}">-</button>
                                    <span class="quantity">${item.quantity}</span>
                                    <button class="btn btn-sm btn-secondary" data-increase="${item.productId}" 
                                        ${item.quantity >= item.product.stock ? 'disabled' : ''}>+</button>
                                </div>
                                <div class="item-total">
                                    <strong>${(item.product.price * item.quantity).toFixed(2)} ₺</strong>
                                    <button class="btn btn-sm btn-danger" data-remove="${item.productId}">Sil</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="cart-total">
                        <h3>Toplam: ${total.toFixed(2)} ₺</h3>
                    </div>
                `}
                <div class="modal-actions">
                    ${cart.length > 0 ? '<button class="btn btn-danger" id="clearCartBtn">Sepeti Temizle</button>' : ''}
                    ${cart.length > 0 ? '<button class="btn btn-success" id="confirmCartBtn">✓ Sepeti Onayla</button>' : ''}
                    <button class="btn btn-secondary" id="closeBtn">Kapat</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const closeModal = () => {
        modal.remove();
        const cartCountEl = document.querySelector('#cartCount');
        if (cartCountEl) {
            const cart = cartService.getAll(user.id);
            cartCountEl.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        }
    };

    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
    modal.querySelector('#closeBtn').addEventListener('click', closeModal);

    if (cart.length > 0) {
        modal.querySelector('#clearCartBtn').addEventListener('click', () => {
            cartService.clear(user.id);
            showToast('Sepet temizlendi', 'info');
            closeModal();
            showCart(user);
        });

        modal.querySelector('#confirmCartBtn').addEventListener('click', () => {
            const result = cartService.confirmCart(user.id);
            
            if (result.success) {
                showToast(result.message, 'success');
                closeModal();
                updateCounts();
                renderProducts(); // Stok güncellemelerini göster
            } else {
                showToast(result.message, 'error');
                if (result.partialSuccess) {
                    closeModal();
                    showCart(user);
                }
            }
        });
    }

    modal.querySelectorAll('[data-increase]').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = btn.dataset.increase;
            const item = cart.find(i => i.productId === productId);
            const result = cartService.updateQuantity(user.id, productId, item.quantity + 1);
            
            if (result.success) {
                closeModal();
                showCart(user);
            } else {
                showToast(result.message, 'error');
            }
        });
    });

    modal.querySelectorAll('[data-decrease]').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = btn.dataset.decrease;
            const item = cart.find(i => i.productId === productId);
            if (item.quantity > 1) {
                cartService.updateQuantity(user.id, productId, item.quantity - 1);
                closeModal();
                showCart(user);
            } else {
                cartService.remove(user.id, productId);
                showToast('Ürün sepetten çıkarıldı', 'info');
                closeModal();
                showCart(user);
            }
        });
    });

    modal.querySelectorAll('[data-remove]').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = btn.dataset.remove;
            cartService.remove(user.id, productId);
            showToast('Ürün sepetten çıkarıldı', 'info');
            closeModal();
            showCart(user);
        });
    });
}