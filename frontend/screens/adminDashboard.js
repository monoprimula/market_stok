/* eslint-disable no-unused-vars */
import { authService } from "../services/authService.js";
import { productService } from "../services/productService.js";
import { categoryService } from "../services/categoryService.js";
import { logService } from "../services/logService.js";
import { createNavbar } from "../components/navbar.js";
import { showConfirmModal } from "../components/modal.js";
import { showToast } from "../components/toast.js";
import { reportService } from '../services/reportService.js';

export function renderAdminDashboard(container) {
  const user = authService.getCurrentUser();
  console.log(user.role);

  if (!user || user.role !== "Admin") {
    window.location.hash = "#/login";
    return;
  }

  container.className = "admin-theme";
  container.appendChild(createNavbar(user));

  const dashboard = document.createElement("div");
  dashboard.className = "dashboard";

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

  const tabs = dashboard.querySelectorAll(".tab-btn");
  const tabContent = dashboard.querySelector("#tabContent");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderTabContent(tabContent, tab.dataset.tab);
    });
  });

  renderTabContent(tabContent, "products");
}

function renderTabContent(container, tabName) {
  container.innerHTML = "";
  const user = authService.getCurrentUser();

  switch (tabName) {
    case "products":
      renderProductsTab(container, user);
      break;
    case "categories":
      renderCategoriesTab(container, user);
      break;
    case "users":
      renderUsersTab(container);
      break;
    case "reports":
      renderReportsTab(container);
      break;
    case "logs":
      renderLogsTab(container);
      break;
  }
}





async function renderProductsTab(container, user) {
  let products = [];
  let categories = [];

  const currentUser = authService.getCurrentUser();
  const isStaff = currentUser && currentUser.role === 'Staff';

  try {
    const productsPromise = isStaff
        ? productService.getProductsByCreator(currentUser.id) 
        : productService.getProducts(); 
        
    [products, categories] = await Promise.all([
      productsPromise,
      categoryService.getCategories(),
    ]);

  } catch (error) {
    showToast("Ürünler veya kategoriler yüklenirken hata oluştu.", "error");
    console.error("Ürün Sekmesi Yükleme Hatası:", error);
    return;
  }

  products = Array.isArray(products) ? products : [];
  categories = Array.isArray(categories) ? categories : [];

  const wrapper = document.createElement("div");

  wrapper.innerHTML = `
        <div class="tab-header">
            <div>
                <h2>Ürün Yönetimi</h2>
                <p class="tab-subtitle">${products.length} ürün kayıtlı${isStaff ? ' (Sadece kendi ürünleriniz)' : ''}</p>
            </div>
            <button class="btn btn-primary" id="addProductBtn">+ Yeni Ürün</button>
        </div>
        <div class="filters">
            <input type="text" id="searchInput" class="search-input" placeholder="Ürün ara (ad veya barkod)...">
            <select id="categoryFilter" class="filter-select">
                <option value="">Tüm Kategoriler</option>
                ${categories
                  .map(
                    (cat) => `<option value="${cat.id}">${cat.name}</option>`
                  )
                  .join("")}
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

  const searchInput = wrapper.querySelector("#searchInput");
  const categoryFilter = wrapper.querySelector("#categoryFilter");
  const tbody = wrapper.querySelector("#productsTableBody");

 
  function updateProductsTable() {
    const searchQuery = searchInput.value;
    const categoryId = categoryFilter.value;

    // Filtreleme mantığı
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.barcode_no.includes(searchQuery)
      );
    }

    if (categoryId) {
      filtered = filtered.filter((p) => String(p.category_id) === categoryId);
    }

    // Tabloyu Doldurma
    tbody.innerHTML =
      filtered
        .map((product) => {
          const category = categories.find(
            (c) => String(c.id) === String(product.category_id)
          );

          return `
                <tr>
                    <td><strong>${product.name}</strong></td>
                    <td><code>${product.barcode_no}</code></td>
                    <td>${category ? category.name : "Bilinmiyor"}</td>
                    <td>${parseFloat(product.price).toFixed(2)} ₺</td>
                    <td><span class="badge ${
                      product.stock_quantity < 10
                        ? "badge-danger"
                        : "badge-success"
                    }">${product.stock_quantity}</span></td>
                    <td>
                        <button class="btn btn-sm btn-secondary" data-edit="${
                          product.id
                        }">Düzenle</button>
                        <button class="btn btn-sm btn-danger" data-delete="${
                          product.id
                        }">Sil</button>
                    </td>
                </tr>
            `;
        })
        .join("") ||
      '<tr><td colspan="6" class="text-center">Ürün bulunamadı</td></tr>';

    tbody.querySelectorAll("[data-edit]").forEach((btn) => {
      btn.addEventListener("click", () =>
        showProductForm(btn.dataset.edit, user)
      );
    });

    // Silme İşlemi 
    tbody.querySelectorAll("[data-delete]").forEach((btn) => {
        if (currentUser.role !== 'Admin') {
             btn.disabled = true; 
             btn.style.opacity = '0.5';
             return;
        }

      btn.addEventListener("click", () => {
        const product = filtered.find(
          (p) => String(p.id) === btn.dataset.delete
        );

      
        if (!product) {
          showToast("Silinecek ürün listede bulunamadı.", "error");
          return;
        }

        showConfirmModal(
          `"${product.name}" ürününü silmek istediğinizden emin misiniz?`,
          async () => {
            try {
              await productService.deleteProduct(btn.dataset.delete);
              logService.add(
                "Ürün Silindi",
                `${product.name} (${product.barcode_no})`,
                user.id,
                user.role
              );
              showToast("Ürün başarıyla silindi", "success");

              // Yeniden yükleme
              renderTabContent(
                document.querySelector("#tabContent"),
                "products",
                user
              );
            } catch (error) {
              const errorMessage =
                error.response?.data?.error ||
                "Ürün silinirken bir hata oluştu.";
              showToast(errorMessage, "error");
              console.error("Ürün Silme Hatası:", error);
            }
          }
        );
      });
    });
  }

  searchInput.addEventListener("input", updateProductsTable);
  categoryFilter.addEventListener("change", updateProductsTable);
  wrapper
    .querySelector("#addProductBtn")
    .addEventListener("click", () => showProductForm(null, user));

  updateProductsTable();
}
async function showProductForm(productId, user) { 
    
    //  Ürün ve Kategori Verilerini API'den Çekme
    let product = null;
    let categories = [];
    let loadError = null;

    try {
        categories = await categoryService.getCategories(); 
        if (productId) {
            product = await productService.getProductById(productId); 
        }
    } catch (error) {
        loadError = error.response?.data?.error || 'Veriler yüklenirken bir hata oluştu.';
        showToast(loadError, 'error');
        console.error('Ürün Formu Veri Yükleme Hatası:', error);
        if (productId) return; 
    }

    const modal = document.createElement('div');
    modal.className = 'modal';
    
    // Form alanlarına image_url eklendi
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
                        <input type="text" id="name" name="name" value="${
                          product?.name || ""
                        }" required>
                    </div>
                    <div class="form-group">
                        <label for="barcode">Barkod *</label>
                        <input type="text" id="barcode" name="barcode_no" value="${ 
                          product?.barcode_no || ""
                        }" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="image_url">Görsel URL (İsteğe Bağlı)</label>
                        <input type="url" id="image_url" name="image_url" value="${
                          product?.image_url || ""
                        }">
                    </div>
                    
                    <div class="form-group">
                        <label for="categoryId">Kategori *</label>
                        <select id="categoryId" name="category_id" required> <option value="">Seçiniz</option>
                            ${categories.map(cat => `
                                <option value="${cat.id}" ${
                                  String(product?.category_id) === String(cat.id) ? 'selected' : '' 
                                }>
                                    ${cat.name}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="price">Fiyat (₺) *</label>
                        <input type="number" id="price" name="price" step="0.01" min="0" value="${
                          product?.price || ""
                        }" required>
                    </div>
                    <div class="form-group">
                        <label for="stock">Stok *</label>
                        <input type="number" id="stock" name="stock_quantity" min="0" value="${ // 
                          product?.stock_quantity || ""
                        }" required>
                    </div>
                    <div class="form-group">
                        <label for="description">Açıklama</label>
                        <textarea id="description" name="description" rows="3">${
                          product?.description || ""
                        }</textarea>
                    </div>

                    <div id="formErrors" class="error-message">${loadError || ''}</div>
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

    form.addEventListener('submit', async (e) => { 
        e.preventDefault();
        formErrors.textContent = '';

        const formData = new FormData(form);
        const rawData = Object.fromEntries(formData.entries());

        // Veri Hazırlama ve Tip Dönüşümü
        const dataToSend = {
            name: rawData.name ? rawData.name.trim() : null,
            barcode_no: rawData.barcode_no ? rawData.barcode_no.trim() : null, 
            description: rawData.description ? rawData.description.trim() : null,
            
           
            image_url: rawData.image_url ? rawData.image_url.trim() : null,

            
            price: parseFloat(rawData.price),
            category_id: parseInt(rawData.category_id),
            stock_quantity: parseInt(rawData.stock_quantity), 
        };

        // Zorunlu Alan Kontrolü
        if (!dataToSend.name || !dataToSend.barcode_no) {
            formErrors.textContent = "Ürün Adı ve Barkod zorunlu alanlardır.";
            showToast("Lütfen tüm zorunlu alanları doldurun.", 'error');
            return;
        }

        // Sayısal Değer Kontrolü
        if (
            isNaN(dataToSend.price) || 
            isNaN(dataToSend.stock_quantity) || 
            dataToSend.price < 0 || 
            dataToSend.stock_quantity < 0
        ) {
            formErrors.textContent = "Fiyat ve Stok geçerli sayısal değerler olmalıdır.";
            showToast("Lütfen geçerli stok ve fiyat giriniz.", 'error');
            return;
        }


        try {
            if (productId) {
                // UPDATE:
                await productService.updateProduct(productId, dataToSend); // 
                logService.add('Ürün Güncellendi (Admin)', `${dataToSend.name} (${dataToSend.barcode_no})`, user.id, user.role);
                showToast('Ürün başarıyla güncellendi', 'success');
            } else {
                // CREATE:
                await productService.createProduct(dataToSend); // 
                logService.add('Ürün Eklendi (Admin)', `${dataToSend.name} (${dataToSend.barcode_no})`, user.id, user.role);
                showToast('Ürün başarıyla eklendi', 'success');
            }
            
            closeModal();
            // Tab içeriğini yenile
            renderTabContent(document.querySelector('#tabContent'), 'products', user);
            
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'İşlem başarısız oldu.';
            formErrors.textContent = errorMessage;
            showToast(errorMessage, 'error');
            console.error('Ürün CRUD Hatası:', error);
        }
    });
}

async function renderCategoriesTab(container, user) {
  let categories = [];
  try {
    categories = await categoryService.getCategories();
    categories = Array.isArray(categories) ? categories : [];
  } catch (error) {
    showToast("Kategoriler yüklenirken hata oluştu.", "error");
    return;
  }

  const wrapper = document.createElement("div");
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
                    <th>Oluşturma Tarihi</th>
                    <th>İşlemler</th>
                </tr>
            </thead>
            <tbody id="categoriesTableBody"></tbody>
        </table>
    </div>
    `;
    container.appendChild(wrapper);

  const tbody = wrapper.querySelector("#categoriesTableBody");

  async function updateCategoriesTable() {
    let currentCategories = [];
    try {
      currentCategories = await categoryService.getCategories();
      currentCategories = Array.isArray(currentCategories)
        ? currentCategories
        : []; 
    } catch (error) {
      showToast("Kategoriler yenilenirken hata.", "error");
      return;
    }

    tbody.innerHTML =
      currentCategories
        .map((cat) => {
          const rawDate = cat.created_at;
          const formattedDate =
            rawDate &&
            new Date(rawDate) instanceof Date &&
            !isNaN(new Date(rawDate))
              ? new Date(rawDate).toLocaleDateString("tr-TR")
              : "-";

          return `
                <tr>
                    <td><strong>${cat.name}</strong></td>
                    <td>${formattedDate}</td> <td>
                        <button class="btn btn-sm btn-secondary" data-edit="${cat.id}">Düzenle</button>
                        <button class="btn btn-sm btn-danger" data-delete="${cat.id}">Sil</button>
                    </td>
                </tr>
            `;
        }).join('') || '<tr><td colspan="3" class="text-center">Kategori bulunamadı</td></tr>';

    // Silme İşlemi (DELETE)
    tbody.querySelectorAll("[data-delete]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const categoryIdToDelete = btn.dataset.delete;
        const cat = currentCategories.find(c => String(c.id) === categoryIdToDelete);

        if (!cat || !cat.name) {
            showToast('Kategori bilgisi eksik veya bulunamadı. Lütfen sayfayı yenileyin.', 'error');
            return;
        }

        showConfirmModal(
          `Kategoriyi silmek istediğinizden emin misiniz?`,
          async () => {
            try {
              await categoryService.deleteCategory(btn.dataset.delete);
              logService.add("Kategori Silindi", cat.name, user.id, user.role);
              showToast("Kategori başarıyla silindi", "success");
              updateCategoriesTable();
            } catch (error) {
              const errorMessage =
                error.response?.data?.error ||
                "Kategori silinirken bir hata oluştu.";
              showToast(errorMessage, "error");
              console.error("Kategori Silme Hatası:", error);
            }
          }
        );
      });
    });

    // Düzenleme İşlemi
    tbody.querySelectorAll("[data-edit]").forEach((btn) => {
      btn.addEventListener("click", () =>
        showCategoryForm(btn.dataset.edit, user)
      );
    });
  }

  wrapper
    .querySelector("#addCategoryBtn")
    .addEventListener("click", () => showCategoryForm(null, user));
  updateCategoriesTable();
}

async function showCategoryForm(categoryId, user) {
  let category = null;
  if (categoryId) {
    try {
      category = await categoryService.getCategoryById(categoryId); 
    } catch (error) {
      showToast("Kategori verisi yüklenemedi.", "error");
      return;
    }
  }

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>${category ? 'Kategori Düzenle' : 'Yeni Kategori'}</h3>
                <button class="modal-close">&times;</button> </div>
            <div class="modal-body">
                <form id="categoryForm" class="modal-form">
                    <div class="form-group">
                        <label for="name">Kategori Adı *</label>
                        <input type="text" id="name" name="name" value="${category?.name || ''}" required>
                    </div>
                    <div id="formErrors" class="error-message"></div>
                    
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" id="cancelBtn">İptal</button> <button type="submit" class="btn btn-primary">Kaydet</button>
                    </div>
                    
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

  const form = modal.querySelector("#categoryForm");
  const formErrors = modal.querySelector("#formErrors");
  const closeModal = () => modal.remove();

  modal.querySelector(".modal-close").addEventListener("click", closeModal);
  modal.querySelector(".modal-overlay").addEventListener("click", closeModal);
  modal.querySelector("#cancelBtn").addEventListener("click", closeModal);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    formErrors.textContent = "";

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());



    try {
      if (categoryId) {
        // UPDATE
        await categoryService.updateCategory(categoryId, { name: data.name });
        logService.add("Kategori Güncellendi", data.name, user.id, user.role);
        showToast("Kategori başarıyla güncellendi", "success");
      } else {
        // CREATE
       await categoryService.createCategory({ name: data.name });
        logService.add("Kategori Eklendi", data.name, user.id, user.role);
        showToast("Kategori başarıyla eklendi", "success");
      }

      closeModal();

      renderTabContent(document.querySelector("#tabContent"), "categories");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "İşlem başarısız oldu.";
      formErrors.textContent = errorMessage;
      showToast(errorMessage, "error");
      console.error("Kategori CRUD Hatası:", error);
    }
  });
}

async function renderUsersTab(container) { 
    const currentUser = authService.getCurrentUser();
    
    // Kullanıcı verilerini çekme 
    let users = [];
    try {
        users = await authService.getAllUsers(); 
        users = Array.isArray(users) ? users : []; 
    } catch (error) {
        showToast('Kullanıcı listesi yüklenirken hata oluştu.', 'error');
        console.error('Kullanıcı Yükleme Hatası:', error);
    }

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

    // Tabloyu Güncelleme Fonksiyonu
    async function updateUsersTable() { 
        let currentUsers = [];
        try {
            currentUsers = await authService.getAllUsers(); 
            currentUsers = Array.isArray(currentUsers) ? currentUsers : [];
        } catch (error) {
            showToast('Kullanıcı listesi yenilenirken hata.', 'error');
            return;
        }

        // Tabloyu doldurma
        tbody.innerHTML = currentUsers.map(u => {
            // Tarih Biçimlendirme Kontrolü
            const formattedDate = (u.createdAt && new Date(u.createdAt) instanceof Date && !isNaN(new Date(u.createdAt)))
                ? new Date(u.createdAt).toLocaleDateString('tr-TR')
                : '-'; 
               const userRole = u.role?.role_name || 'User';
                
            return `
        <tr>
            <td><strong>${u.username}</strong> ${u.id === currentUser.id ? '<span class="badge badge-info">Siz</span>' : ''}</td>
            <td>${u.email}</td>
            <td>
            <select class="role-select" data-user-id="${u.id}" ${u.id === currentUser.id ? 'disabled' : ''}>
                <option value="1" ${userRole === 'Admin' ? 'selected' : ''}>Yönetici</option>
                <option value="2" ${userRole === 'Staff' ? 'selected' : ''}>Personel</option>
                <option value="3" ${userRole === 'User' ? 'selected' : ''}>Kullanıcı</option>
            </select>
        </td>
            <td>${formattedDate}</td>
            <td>
                ${u.id !== currentUser.id ? `<button class="btn btn-sm btn-danger" data-delete="${u.id}">Sil</button>` : '-'}
            </td>
        </tr>
    `;
}).join('');

        //  Rol Güncelleme İşlemi
       tbody.querySelectorAll('.role-select').forEach(select => {
    select.addEventListener('change', async (e) => {
        const userId = e.target.dataset.userId;
        const newRoleId = parseInt(e.target.value); 
        
  
        let newRoleName;
        
        if (newRoleId === 1) newRoleName = 'Admin';
        else if (newRoleId === 2) newRoleName = 'Staff';
        else if (newRoleId === 3) newRoleName = 'User';
        else {
            showToast('Geçersiz rol seçimi.', 'error');
            return;
        }

        const userToUpdate = currentUsers.find(u => String(u.id) === userId);
        
        try {
            
            await authService.updateUserRole(userId, newRoleId); 
            
            
            logService.add('Kullanıcı Rolü Güncellendi', `${userToUpdate.email} -> ${newRoleName}`, currentUser.id, currentUser.role);
            
            showToast(`Kullanıcı rolü başarıyla ${newRoleName} olarak güncellendi.`, 'success');
         
     
            updateUsersTable(); 
            
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Rol güncellenirken sunucu hatası.';
            showToast(errorMessage, 'error');
            
          
            updateUsersTable(); 

            console.error('Rol Güncelleme Hatası:', error);
        }
    });
});
        //  Kullanıcı Silme İşlemi
        tbody.querySelectorAll('[data-delete]').forEach(btn => {
            btn.addEventListener('click', () => {
                const userToDelete = currentUsers.find(u => String(u.id) === btn.dataset.delete); 
                
                if (!userToDelete) return;

                showConfirmModal(`"${userToDelete.name}" kullanıcısını silmek istediğinizden emin misiniz?`, async () => { 
                    try {
                        await authService.deleteUser(btn.dataset.delete); 
                        logService.add('Kullanıcı Silindi', userToDelete.email, currentUser.id, currentUser.role);
                        showToast('Kullanıcı başarıyla silindi', 'success');
                        updateUsersTable(); 
                    } catch (error) {
                        const errorMessage = error.response?.data?.error || 'Kullanıcı silinirken hata oluştu.';
                        showToast(errorMessage, 'error');
                        console.error('Kullanıcı Silme Hatası:', error);
                    }
                });
            });
        });
    }

    updateUsersTable();
}



async function renderReportsTab(container) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<h2>Raporlar Yükleniyor...</h2>`;
    container.appendChild(wrapper);

    // İstatistik ve Kritik Stok Verilerini Yükleme
    let stats = {};
    let lowStockProducts = [];
    try {
       const [loadedStats, loadedLowStock] = await Promise.all([
            reportService.getDashboardStats(), 
            reportService.getLowStockProducts() 
        ]);
        stats = loadedStats && typeof loadedStats === 'object' ? loadedStats : {};
        lowStockProducts = Array.isArray(loadedLowStock) ? loadedLowStock : [];
        
    } catch (error) {
        showToast('Rapor verileri yüklenirken hata oluştu.', 'error');
        console.error('Rapor Yükleme Hatası:', error);
        wrapper.innerHTML = `<h2 class="error-message">Raporlar yüklenirken bir sorun oluştu.</h2>`;
        return;
    }
    wrapper.innerHTML = `
        <div class="tab-header">
            <div>
                <h2>Sistem Raporu ve İstatistikler</h2>
                <p class="tab-subtitle">Güncel envanter, kullanıcı ve sipariş özeti</p>
            </div>
            <button class="btn btn-primary" id="downloadCsvBtn">
                <i class="fa fa-download"></i> Rapor İndir (CSV)
            </button>
        </div>
        
        <div class="summary-cards">
            <div class="card summary-card">
                <h4>Toplam Gelir</h4>
                <p class="summary-value">${(stats.totalRevenue || 0).toFixed(2)} ₺</p>
            </div>
            <div class="card summary-card">
                <h4>Toplam Ürün</h4>
                <p class="summary-value">${stats.totalProducts || 0}</p>
            </div>
            <div class="card summary-card">
                <h4>Toplam Sipariş</h4>
                <p class="summary-value">${stats.totalOrders || 0}</p>
            </div>
            <div class="card summary-card">
                <h4>Kritik Stok</h4>
                <p class="summary-value badge ${stats.lowStockCount > 0 ? 'badge-danger' : 'badge-success'}">
                    ${stats.lowStockCount || 0}
                </p>
            </div>
        </div>

        <h3>Kritik Stoktaki Ürünler</h3>
        <div class="table-container">
            <table class="data-table small-table">
                <thead>
                    <tr>
                        <th>Ürün Adı</th>
                        <th>Barkod</th>
                        <th>Kategori</th>
                        <th>Stok Miktarı</th>
                    </tr>
                </thead>
                <tbody id="lowStockTableBody">
                    ${lowStockProducts.map(p => `
                        <tr>
                            <td>${p.name}</td>
                            <td>${p.barcode_no || '-'}</td>
                            <td>${p.category?.name || 'Yok'}</td>
                            <td><span class="badge badge-danger">${p.stock_quantity}</span></td>
                        </tr>
                    `).join('')}
                    ${lowStockProducts.length === 0 ? '<tr><td colspan="4" class="text-center">Kritik stokta ürün bulunmamaktadır.</td></tr>' : ''}
                </tbody>
            </table>
        </div>
    `;

    const downloadButton = wrapper.querySelector('#downloadCsvBtn');
    
    // Güvenlik kontrolü ekleyelim
    if (downloadButton) {
        downloadButton.addEventListener('click', async () => {
        
            showToast('Rapor indirme işlemi başlatılıyor...', 'info');
            
            try {
         
                const blob = await reportService.downloadGeneralReport(); 
                console.log('API’den Gelen Veri Tipi:', typeof blob, blob instanceof Blob);
                
               if (!(blob instanceof Blob)) {
            // Eğer Blob değilse (Muhtemelen bir JSON objesi veya string), işlemi durdur
            console.error('Hata: API geçerli bir Blob nesnesi döndürmedi.', blob);
            showToast('Rapor verisi Blob formatında alınamadı. Yetkiyi veya API çıktısını kontrol edin.', 'error');
            return; // İşlemi burada kes
        }
                const url = window.URL.createObjectURL(blob);
                
   
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'genel_durum_raporu.csv'; 
                
                document.body.appendChild(a);
                a.click(); 
                
             
                window.URL.revokeObjectURL(url);
                a.remove();
                
                showToast('Rapor başarıyla indirildi.', 'success');

            } catch (error) {
                showToast('Rapor indirme hatası. Yetkinizi ve konsolu kontrol edin.', 'error');
                console.error('CSV İndirme Hatası:', error);
            }
        });
    } else {
        console.error("CSV İndirme düğmesi (#downloadCsvBtn) HTML'de bulunamadı.");
    }
}

function renderLogsTab(container) {
  const logs = logService.getAll();

  const wrapper = document.createElement("div");
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
                    ${
                      logs
                        .map(
                          (log) => `
                        <tr>
                            <td>${new Date(log.timestamp).toLocaleString(
                              "tr-TR"
                            )}</td>
                            <td><span class="badge badge-info">${
                              log.action
                            }</span></td>
                            <td>${log.details}</td>
                            <td>${log.userRole}</td>
                        </tr>
                    `
                        )
                        .join("") ||
                      '<tr><td colspan="4" class="text-center">İşlem kaydı yok</td></tr>'
                    }
                </tbody>
            </table>
        </div>
    `;
  container.appendChild(wrapper);

  wrapper.querySelector("#exportLogsBtn").addEventListener("click", () => {
    logService.exportToCSV();
    showToast("İşlem geçmişi başarıyla indirildi", "success");
  });

  wrapper.querySelector("#clearLogsBtn").addEventListener("click", () => {
    showConfirmModal(
      "Tüm işlem geçmişini silmek istediğinizden emin misiniz?",
      () => {
        logService.clear();
        showToast("İşlem geçmişi temizlendi", "success");
        renderTabContent(container.parentElement, "logs");
      }
    );
  });
}
