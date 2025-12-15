import { authService } from "../services/authService.js";
import { productService } from "../services/productService.js";
import { categoryService } from "../services/categoryService.js";
import { logService } from "../services/logService.js";
import { createNavbar } from "../components/navbar.js";
import { showToast } from "../components/toast.js";

export function renderStaffDashboard(container) {
  const user = authService.getCurrentUser();

  if (!user || user.role !== "Staff") {
    window.location.hash = "#/login";
    return;
  }

  container.className = "staff-theme";
  container.appendChild(createNavbar(user));

  const dashboard = document.createElement("div");
  dashboard.className = "dashboard";

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

  const tabs = dashboard.querySelectorAll(".tab-btn");
  const tabContent = dashboard.querySelector("#tabContent");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderTabContent(tabContent, tab.dataset.tab, user);
    });
  });

  renderTabContent(tabContent, "myproducts", user);
}

function renderTabContent(container, tabName, user) {
  container.innerHTML = "";

  switch (tabName) {
    case "myproducts":
      renderMyProductsTab(container, user);
      break;
    case "allproducts":
      renderAllProductsTab(container, user);
      break;
  }
}

async function renderMyProductsTab(container, user) {
  const [categories, myProducts] = await Promise.all([
    categoryService.getCategories(),
    productService.getProductsByCreator(user.id),
  ]);

  const wrapper = document.createElement("div");

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
  const tbody = wrapper.querySelector("#productsTableBody"); // 👈 tbody tanımı buraya eklendi

  function updateProductsTable() {
    const searchQuery = searchInput.value;
    const categoryId = categoryFilter.value;

    // Veri kaynağı
    let filtered = myProducts;

    //  Arama Filtresi
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.barcode_no.includes(searchQuery)
      );
    }

    // .Kategori Filtresi
    if (categoryId) {
      filtered = filtered.filter((p) => String(p.category_id) === categoryId);
    }

    // Tabloyu DOM'a Basma
    tbody.innerHTML =
      filtered
        .map((product) => {
          const category = categories.find(
            (c) => String(c.id) === String(product.category_id)
          );

          const isMyProduct = product.created_by === user.id;

          return `
                <tr>
                    <td>
                        <strong>${product.name}</strong>
                       
                        
                    </td>
                    <td><code>${product.barcode_no}</code></td>
                    <td>${category ? category.name : "Bilinmiyor"}</td>
                    <td>${parseFloat(product.price).toFixed(2)} ₺</td>
                    <td>
                        <span class="badge ${
                          product.stock_quantity < 10
                            ? "badge-danger"
                            : "badge-success"
                        }">
                            ${product.stock_quantity}
                        </span>
                    </td>
                    <td>
                        ${
                          isMyProduct
                            ? `
                            <button class="btn btn-sm btn-secondary" data-edit="${product.id}">Düzenle</button>
                            <button class="btn btn-sm btn-info" data-stock="${product.id}">Stok Güncelle</button>
                        `
                            : '<span class="text-muted">Görüntüleme</span>'
                        }
                    </td>
                </tr>
            `;
        })
        .join("") ||
      '<tr><td colspan="6" class="text-center">Henüz ürün eklemediniz</td></tr>';

    tbody.querySelectorAll("[data-edit]").forEach((btn) => {
      btn.addEventListener("click", () =>
        showProductForm(btn.dataset.edit, user)
      );
    });

    tbody.querySelectorAll("[data-stock]").forEach((btn) => {
      btn.addEventListener("click", () =>
        showStockUpdateForm(btn.dataset.stock, user)
      );
    });
  }

  searchInput.addEventListener("input", updateProductsTable);
  categoryFilter.addEventListener("change", updateProductsTable);

  wrapper
    .querySelector("#addProductBtn")
    .addEventListener("click", () => showProductForm(null, user));

  updateProductsTable();
}

async function renderAllProductsTab(container, user) {
  const [categories, products] = await Promise.all([
    categoryService.getCategories(),
    productService.getProducts(),
  ]);

  const wrapper = document.createElement("div");
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
                <tbody id="allProductsTableBody"></tbody>
            </table>
        </div>
    `;
  container.appendChild(wrapper);

  const searchInput = wrapper.querySelector("#searchInput");
  const categoryFilter = wrapper.querySelector("#categoryFilter");
  const tbody = wrapper.querySelector("#allProductsTableBody");

  // Filtreleme ve Tablo Güncelleme Fonksiyonu
  function updateProductsTable() {
    const searchQuery = searchInput.value;
    const categoryId = categoryFilter.value;

    let filtered = products;

    //  Arama ve Filtreleme Mantığı
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

    //Tabloyu DOM'a Basma
    tbody.innerHTML =
      filtered
        .map((product) => {
          const category = categories.find(
            (c) => String(c.id) === String(product.category_id)
          );
          const isMyProduct = product.created_by === user.id;

          return `
                <tr>
                    <td>
                        <strong>${product.name}</strong>
                        ${
                          isMyProduct
                            ? '<span class="badge badge-info">Sizin Eklediğiniz Ürün</span>'
                            : ""
                        }
                    </td>
                    <td><code>${product.barcode_no}</code></td> <td>${
            category ? category.name : "Bilinmiyor"
          }</td>
                    <td>${parseFloat(product.price).toFixed(2)} ₺</td> <td>
                        <span class="badge ${
                          product.stock_quantity < 10
                            ? "badge-danger"
                            : "badge-success"
                        }">
                            ${product.stock_quantity}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-secondary" data-edit="${
                          product.id
                        }">Düzenle</button>
                        <button class="btn btn-sm btn-info" data-stock="${
                          product.id
                        }">Stok Güncelle</button>
                    </td>
                </tr>
            `;
        })
        .join("") ||
      '<tr><td colspan="6" class="text-center">Ürün bulunamadı</td></tr>';

    // Event Listener'lar
    tbody.querySelectorAll("[data-edit]").forEach((btn) => {
      btn.addEventListener("click", () =>
        showProductForm(btn.dataset.edit, user)
      );
    });

    tbody.querySelectorAll("[data-stock]").forEach((btn) => {
      btn.addEventListener("click", () =>
        showStockUpdateForm(btn.dataset.stock, user)
      );
    });
  }

  searchInput.addEventListener("input", updateProductsTable);
  categoryFilter.addEventListener("change", updateProductsTable);

  updateProductsTable();
}

async function showProductForm(productId, user) {
  const product = productId
    ? await productService.getProductById(productId)
    : null;
  const categories = await categoryService.getCategories(); //

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>${product ? "Ürün Düzenle" : "Yeni Ürün Ekle"}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <form id="productForm" class="modal-form">
                    <div class="form-group">
                        <label for="name">Ürün Adı *</label>
                        <input type="text" id="name" name="name" value="${
                          product?.name || ""
                        }" required>
                        <small>Ürün adını giriniz</small>
                    </div>
                    <div class="form-group">
                        <label for="barcode">Barkod *</label>
                        <input type="text" id="barcode" name="barcode_no" value="${
                          product?.barcode_no || ""
                        }" required>
                        <small>Ürün barkod numarasını giriniz</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="image_url">Görsel URL (İsteğe Bağlı)</label>
                        <input type="url" id="image_url" name="image_url" value="${
                          product?.image_url || ""
                        }">
                        <small>Ürünün görsel linkini buraya yapıştırın (http://...)</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="categoryId">Kategori *</label>
                        <select id="categoryId" name="category_id" required>
                            <option value="">Seçiniz</option>
                            ${categories
                              .map(
                                (cat) => `
                                <option value="${cat.id}" ${
                                  product?.category_id === cat.id
                                    ? "selected"
                                    : ""
                                }>
                                    ${cat.name}
                                </option>
                            `
                              )
                              .join("")}
                        </select>
                        <small>Ürün kategorisini seçiniz</small>
                    </div>
                    <div class="form-group">
                        <label for="price">Fiyat (₺) *</label>
                        <input type="number" id="price" name="price" step="0.01" min="0" value="${
                          product?.price || ""
                        }" required>
                        <small>Sadece sayı girebilirsiniz (örn: 25.50)</small>
                    </div>
                    <div class="form-group">
                        <label for="stock">Stok Miktarı *</label>
                        <input type="number" id="stock" name="stock_quantity" min="0" value="${
                          product?.stock_quantity || ""
                        }" required>
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

  const form = modal.querySelector("#productForm");
  const formErrors = modal.querySelector("#formErrors");
  const closeModal = () => modal.remove();

  modal.querySelector(".modal-close").addEventListener("click", closeModal);
  modal.querySelector(".modal-overlay").addEventListener("click", closeModal);
  modal.querySelector("#cancelBtn").addEventListener("click", closeModal);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    formErrors.textContent = "";

    const formData = new FormData(form);
    const rawData = Object.fromEntries(formData.entries());

    const dataToSend = {
      name: rawData.name ? rawData.name.trim() : null,
      // 🌟 image_url'yi dataToSend objesine ekle
      image_url: rawData.image_url ? rawData.image_url.trim() : null,
      description: rawData.description ? rawData.description.trim() : null,
      price: parseFloat(rawData.price),

      barcode_no: rawData.barcode_no ? rawData.barcode_no.trim() : null,
      category_id: parseInt(rawData.category_id),
      stock_quantity: parseInt(rawData.stock_quantity),
    };

    // Boşluk kontrolü (name ve barcode_no zorunludur)
    if (!dataToSend.name || !dataToSend.barcode_no) {
      formErrors.textContent = "Ürün Adı ve Barkod zorunlu alanlardır.";
      showToast("Lütfen tüm zorunlu alanları doldurun.", "error");
      return;
    }

    // Sayısal Değer ve Geçerlilik Kontrolü
    if (
      isNaN(dataToSend.price) ||
      isNaN(dataToSend.stock_quantity) ||
      isNaN(dataToSend.category_id) ||
      dataToSend.price < 0 ||
      dataToSend.stock_quantity < 0
    ) {
      formErrors.textContent =
        "Fiyat, Stok ve Kategori geçerli sayısal değerler olmalıdır.";
      showToast("Lütfen geçerli stok ve fiyat giriniz.", "error");
      return;
    }

    // Ek Kontrol: Kategori seçildi mi? (ID 0 veya NaN olmamalı)
    if (dataToSend.category_id === 0 || dataToSend.category_id < 0) {
      formErrors.textContent = "Lütfen bir kategori seçin.";
      showToast("Lütfen bir kategori seçin.", "error");
      return;
    }

    try {
      if (productId) {
        // UPDATE:
        await productService.updateProduct(productId, dataToSend);
        logService.add(
          "Ürün Güncellendi",
          `${dataToSend.name} (${dataToSend.barcode_no})`,
          user.id,
          user.role
        );
        showToast("Ürün başarıyla güncellendi", "success");
      } else {
        // CREATE:
        await productService.createProduct(dataToSend);
        logService.add(
          "Ürün Eklendi",
          `${dataToSend.name} (${dataToSend.barcode_no})`,
          user.id,
          user.role
        );
        showToast("Ürün başarıyla eklendi", "success");
      }

      closeModal();
      renderTabContent(
        document.querySelector("#tabContent"),
        "myproducts",
        user
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "İşlem başarısız oldu.";
      formErrors.textContent = errorMessage;
      showToast(errorMessage, "error");
    }
  });
}

async function showStockUpdateForm(productId, user) {
  const product = await productService.getProductById(productId);
  
  // Sadece stok formu HTML'i kullanılmalı
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content modal-small">
            <div class="modal-header">
                <h3>Stok Güncelle: ${product.name}</h3> <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="stock-info">
                    <h4>${product.name}</h4>
                    <p>Mevcut Stok: <strong>${product.stock_quantity}</strong></p>
                </div>
                <form id="stockForm" class="modal-form">
                    <div class="form-group">
                        <label for="newStock">Yeni Stok Miktarı *</label>
                        <input type="number" id="newStock" name="stock_quantity" min="0" value="${product.stock_quantity}" required>
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

  // KRİTİK DÜZELTME: Formu ID'si ile seçin
  const form = modal.querySelector("#stockForm"); 
  const closeModal = () => modal.remove();

  modal.querySelector(".modal-close").addEventListener("click", closeModal);
  modal.querySelector(".modal-overlay").addEventListener("click", closeModal);
  modal.querySelector("#cancelBtn").addEventListener("click", closeModal);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    const rawStock = formData.get("stock_quantity");
    const newStock = parseInt(rawStock ? rawStock.trim() : "");

    if (isNaN(newStock) || newStock < 0) {
      showToast("Lütfen geçerli bir stok miktarı giriniz", "error");
      return;
    }

    try {
      // Stok güncelleme için sadece stok miktarını gönderen doğru metot
      await productService.updateStock(productId, newStock); 

      logService.add(
        "Stok Güncellendi",
        `${product.name}: ${product.stock_quantity} → ${newStock}`,
        user.id,
        user.role
      );
      showToast("Stok başarıyla güncellendi", "success");
      closeModal();

      renderTabContent(
        document.querySelector("#tabContent"),
        "myproducts",
        user
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Stok güncellenirken hata oluştu.";
      showToast(errorMessage, "error");
    }
  });
}