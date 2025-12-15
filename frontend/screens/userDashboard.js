import { authService } from "../services/authService.js";
import { productService } from "../services/productService.js";
import { categoryService } from "../services/categoryService.js";
import { favoriteService } from "../services/favoriteService.js";
import { cartService } from "../services/cartService.js";
import { createNavbar } from "../components/navbar.js";
import { showToast } from "../components/toast.js";

export async function renderUserDashboard(container) {
  const user = authService.getCurrentUser();

  // Yetki Kontrolü
  if (!user || user.role?.toLowerCase() !== "user") {
    window.location.hash = "#/login";
    return;
  }
if (user && !user.name) {
      user.name = user.username; 
  }
  container.className = "user-theme";
  container.innerHTML = "";
  container.appendChild(createNavbar(user));

  const dashboard = document.createElement("div");
  dashboard.className = "dashboard";

  dashboard.innerHTML = `
        <div class="dashboard-header">
            <div>
                <h1>Ürün Kataloğu</h1>
                <p>Tüm ürünleri görüntüleyin ve arayın</p>
            </div>
            <div class="header-actions">
                <button class="btn btn-secondary" id="viewFavoritesBtn">
                    ⭐ Favorilerim (<span id="favCount">...</span>)
                </button>
                <button class="btn btn-primary" id="viewCartBtn">
                    🛒 Sepetim (<span id="cartCount">...</span>)
                </button>
            </div>
        </div>
        <div class="filters">
            <input type="text" id="searchInput" class="search-input" placeholder="Ürün ara (ad veya barkod)...">
            <select id="categoryFilter" class="filter-select">
                <option value="">Tüm Kategoriler</option>
            </select>
        </div>
        <div id="loadingMessage" class="text-center" style="display:none;">Yükleniyor...</div>
        <div id="productList" class="product-grid"></div>
    `;

  container.appendChild(dashboard);

  // Element Seçimleri
  const searchInput = dashboard.querySelector("#searchInput");
  const categoryFilter = dashboard.querySelector("#categoryFilter");
  const productList = dashboard.querySelector("#productList");
  const favCountSpan = dashboard.querySelector("#favCount");
  const cartCountSpan = dashboard.querySelector("#cartCount");
  const loadingMessage = dashboard.querySelector("#loadingMessage");

  //  Kategorileri Yükle
  const loadCategories = async () => {
    try {
      const categories = await categoryService.getCategories();
      if (categories && Array.isArray(categories)) {
        categories.forEach((cat) => {
          const option = document.createElement("option");
          option.value = cat.id;
          option.textContent = cat.name;
          categoryFilter.appendChild(option);
        });
      }
    } catch (error) {
      console.error("Kategori yükleme hatası:", error);
    }
  };

  //  Sayaçları Güncelle
  const updateCounts = async () => {
    try {
      const [favorites, cart] = await Promise.all([
        favoriteService.getFavorites(user.id),
        cartService.getCart(),
      ]);

      favCountSpan.textContent = favorites ? favorites.length : 0;

      const totalItems = cart
        ? cart.reduce((sum, item) => sum + item.quantity, 0)
        : 0;
      cartCountSpan.textContent = totalItems;
    } catch (error) {
      console.error("Sayaç güncelleme hatası:", error);
    }
  };

  //  Ürünleri Listele
  const renderProducts = async () => {
    loadingMessage.style.display = "block";
    productList.innerHTML = "";

    try {
      const searchQuery = searchInput.value.toLowerCase();
      const selectedCategoryId = categoryFilter.value;

      // Verileri çek
      const [allProducts, favorites, categories] = await Promise.all([
        productService.getProducts(selectedCategoryId),
        favoriteService.getFavorites(user.id),
        categoryService.getCategories(),
      ]);

      // Favori ID'lerini çıkar
      const favoriteIds = favorites.map((f) => f.productId || f.id);

      // Frontend tarafında Arama Filtreleme
      let filteredProducts = allProducts;
      if (searchQuery) {
        filteredProducts = allProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery) ||
            (p.barcode_no && p.barcode_no.includes(searchQuery))
        );
      }
      // Kategori filtreleme (Backend yapmadıysa)
      if (selectedCategoryId && selectedCategoryId !== "") {
        filteredProducts = filteredProducts.filter(
          (p) => p.category_id == selectedCategoryId
        );
      }

      loadingMessage.style.display = "none";

      if (!filteredProducts || filteredProducts.length === 0) {
        productList.innerHTML =
          '<div class="empty-state"><p>Ürün bulunamadı</p></div>';
        return;
      }

      productList.innerHTML = filteredProducts
        .map((product) => {
          const category = categories.find((c) => c.id == product.category_id);
          const isFavorite =
            favoriteIds.includes(product.id) ||
            favoriteIds.includes(Number(product.id));

        
          const imageUrl = product.image_url || 'assets/placeholder-product.png'; 

          return `
                    <div class="product-card">
                        
                        <div class="product-image-container">
                            <img 
                                src="${imageUrl}" 
                                alt="${product.name} görseli" 
                                class="product-image"
                                onerror="this.onerror=null;this.src='${'assets/placeholder-product.png'}';" 
                            />
                        </div>

                        <div class="product-info-content">
                            <div class="product-header">
                                <div>
                                    <h3>${product.name}</h3>
                                    <span class="badge badge-category">${
                                      category ? category.name : "Diğer"
                                    }</span>
                                </div>
                                <button class="favorite-btn ${
                                  isFavorite ? "active" : ""
                                }" data-product-id="${product.id}">
                                    ${isFavorite ? "⭐" : "☆"}
                                </button>
                            </div>
                            <p class="product-barcode"><small>Barkod: ${
                              product.barcode_no || "-"
                            }</small></p>
                            <p class="product-price">${Number(
                              product.price
                            ).toFixed(2)} ₺</p>
                            <p class="product-stock ${
                              product.stock_quantity < 10 ? "low-stock" : ""
                            }">
                                ${
                                  product.stock_quantity > 0
                                    ? `Stok: ${product.stock_quantity}`
                                    : "Stokta Yok"
                                }
                            </p>
                            <div class="product-actions">
                                <button class="btn btn-sm btn-secondary" data-view="${
                                  product.id
                                }">Detay</button>
                                <button class="btn btn-sm btn-primary" data-cart="${
                                  product.id
                                }" ${product.stock_quantity === 0 ? "disabled" : ""}>
                                    🛒 Sepete Ekle
                                </button>
                            </div>
                        </div>
                    </div>
                `;
        })
        .join("");
      // Favori Butonları
      productList.querySelectorAll(".favorite-btn").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          e.stopPropagation();
          const btnEl = e.currentTarget;
          const productId = btnEl.dataset.productId;
          const isCurrentlyActive = btnEl.classList.contains("active");

          btnEl.classList.toggle("active");
          btnEl.textContent = isCurrentlyActive ? "☆" : "⭐";

          let result;
          if (isCurrentlyActive) {
            result = await favoriteService.removeFavorite(productId);
            if (!result.success) {
              btnEl.classList.add("active");
              btnEl.textContent = "⭐";
              showToast("Hata: Favoriden çıkarılamadı", "error");
            } else {
              showToast("Favorilerden çıkarıldı", "info");
            }
          } else {
            result = await favoriteService.addFavorite(productId);
            if (!result.success) {
              btnEl.classList.remove("active");
              btnEl.textContent = "☆";
              showToast("Hata: Favorilere eklenemedi", "error");
            } else {
              showToast("Favorilere eklendi", "success");
            }
          }
          updateCounts();
        });
      });

      // Detay Butonları
      productList.querySelectorAll("[data-view]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const product = filteredProducts.find(
            (p) => p.id == btn.dataset.view
          );
          showProductDetail(product);
        });
      });

      // Sepete Ekle Butonları
      productList.querySelectorAll("[data-cart]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const productId = btn.dataset.cart;
          const product = filteredProducts.find((p) => p.id == productId);
          console.log("Ürün:", product);

         
          const result = await cartService.addToCart(product.id, 1);

          if (result.success) {
            showToast(`${product.name} sepete eklendi`, "success");
            updateCounts();
          } else {
            showToast(result.message, "error");
          }
        });
      });
    }catch (error) {
      console.error("Ürün listeleme hatası:", error);
      loadingMessage.textContent = "Ürünler yüklenirken bir hata oluştu.";
      loadingMessage.style.display = "block";
    }
  };

  // --- Ürün Detay Modalı ---
  async function showProductDetail(product) {
    const categories = await categoryService.getCategories();
    const category = categories.find((c) => c.id == product.category_id);
    const imageUrl = product.image_url || 'assets/placeholder-product.png';

    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content modal-detail"> <div class="modal-header">
                    <h3>Ürün Detayı</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="product-detail">
                        
                        <div class="detail-image-box">
                            <img 
                                src="${imageUrl}" 
                                alt="${product.name} görseli" 
                                class="detail-product-image"
                                onerror="this.onerror=null;this.src='${'assets/placeholder-product.png'}';" 
                            />
                        </div>
                        
                        <div class="detail-info-box">
                            <h2>${product.name}</h2>
                            <div class="detail-row">
                                <span class="label">Kategori:</span>
                                <span class="value">${
                                  category ? category.name : "Bilinmiyor"
                                }</span>
                            </div>
                            <div class="detail-row">
                                <span class="label">Fiyat:</span>
                                <span class="value price">${Number(
                                  product.price
                                ).toFixed(2)} ₺</span>
                            </div>
                            <div class="detail-row">
                                <span class="label">Stok:</span>
                                <span class="value">
                                    <span class="badge ${
                                      product.stock_quantity < 10
                                        ? "badge-danger"
                                        : "badge-success"
                                    }">
                                        ${
                                          product.stock_quantity > 0
                                            ? `${product.stock_quantity} adet`
                                            : "Stokta Yok"
                                        }
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-secondary" id="closeBtn">Kapat</button>
                        <button class="btn btn-primary" id="addToCartBtn" ${
                          product.stock_quantity === 0 ? "disabled" : ""
                        }>
                            🛒 Sepete Ekle
                        </button>
                    </div>
                </div>
            </div>
        `;
    document.body.appendChild(modal);

    const closeModal = () => modal.remove();
    modal.querySelector(".modal-close").addEventListener("click", closeModal);
    modal.querySelector(".modal-overlay").addEventListener("click", closeModal);
    modal.querySelector("#closeBtn").addEventListener("click", closeModal);

    // Sepete Ekle
   modal.querySelector("#addToCartBtn").addEventListener("click", async () => {
      const result = await cartService.addToCart(product.id, 1);
      if (result.success) {
        showToast(`${product.name} sepete eklendi`, "success");
        closeModal();
        updateCounts();
      } else {
        showToast(result.message, "error");
      }
    });
  }

  // --- Favoriler Modalı ---
  async function showFavorites() {
    const favorites = await favoriteService.getFavorites(user.id);
    const allProducts = await productService.getProducts();

    const favProducts = favorites
      .map((fav) => {
        const pId = fav.productId || fav.id;
        return allProducts.find((p) => p.id == pId);
      })
      .filter(Boolean);

    const categories = await categoryService.getCategories();

    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <h3>⭐ Favorilerim (${favProducts.length})</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${
                      favProducts.length === 0
                        ? '<p class="text-center">Henüz favori ürününüz yok</p>'
                        : `
                        <div class="favorites-grid">
                            ${favProducts
                              .map((product) => {
                                const category = categories.find(
                                  (c) => c.id == product.category_id
                                );
                                return `
                                    <div class="favorite-item">
                                        <div>
                                            <h4>${product.name}</h4>
                                            <p class="small">${
                                              category ? category.name : "Diğer"
                                            }</p>
                                            <p class="price">${Number(
                                              product.price
                                            ).toFixed(2)} ₺</p>
                                        </div>
                                        <div class="item-actions">
                                            <button class="btn btn-sm btn-danger" data-remove="${
                                              product.id
                                            }">Çıkar</button>
                                            <button class="btn btn-sm btn-primary" data-cart="${
                                              product.id
                                            }" ${
                                  product.stock === 0 ? "disabled" : ""
                                }>
                                                Sepete Ekle
                                            </button>
                                        </div>
                                    </div>
                                `;
                              })
                              .join("")}
                        </div>
                    `
                    }
                    <div class="modal-actions">
                        <button class="btn btn-secondary" id="closeBtn">Kapat</button>
                    </div>
                </div>
            </div>
        `;
    document.body.appendChild(modal);

    const closeModal = () => {
      modal.remove();
      updateCounts();
      renderProducts();
    };

    modal.querySelector(".modal-close").addEventListener("click", closeModal);
    modal.querySelector(".modal-overlay").addEventListener("click", closeModal);
    modal.querySelector("#closeBtn").addEventListener("click", closeModal);

    // Favoriden Çıkar
    modal.querySelectorAll("[data-remove]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const productId = btn.dataset.remove;
        const result = await favoriteService.removeFavorite(productId);
        if (result.success) {
          showToast("Favorilerden çıkarıldı", "info");
          closeModal();
          showFavorites();
        } else {
          showToast("İşlem başarısız", "error");
        }
      });
    });

    // Sepete Ekle (Async)
    modal.querySelectorAll("[data-cart]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const productId = btn.dataset.cart;
        const result = await cartService.addToCart(productId, 1);
        if (result.success) {
          showToast("Sepete eklendi", "success");
          updateCounts();
        } else {
          showToast(result.message, "error");
        }
      });
    });
  }

  // --- Sepet Modalı ---
  async function showCart() {
    
    const modal = document.createElement("div");
    modal.className = "modal";
    document.body.appendChild(modal);

    const closeModal = () => {
      modal.remove();
    
      updateCounts();
    };
    
    
    const updateCartDisplay = async () => {
        const cartItems = await cartService.getCart();

        const cart = cartItems
            .map((item) => {
                const productInfo  = item.product;
                if (!productInfo) return null;
                return {
                    ...item,
                    productId: item.productId || item.product_id || item.id, 
                    product: productInfo,
                };
            })
            .filter((item) => item.product);

        const total = cart.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        );

        // Modal içeriği (HTML)
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <h3>🛒 Sepetim (${cart.length} ürün)</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${
                      cart.length === 0
                        ? '<p class="text-center">Sepetiniz boş</p>'
                        : `
                        <div class="cart-items">
                            ${cart
                              .map(
                                (item) => `
                                <div class="cart-item">
                                    <div class="item-info">
                                        <h4>${item.product.name}</h4>
                                        <p class="small">Birim Fiyat: ${Number(
                                          item.product.price
                                        ).toFixed(2)} ₺</p>
                                    </div>
                                    <div class="item-quantity">
                                        <button class="btn btn-sm btn-secondary" data-decrease="${
                                          item.productId
                                        }">-</button>
                                        <span class="quantity">${
                                          item.quantity
                                        }</span>
                                        <button class="btn btn-sm btn-secondary" data-increase="${
                                          item.productId
                                        }" 
                                            ${
                                              item.quantity >=
                                              item.product.stock_quantity
                                                ? "disabled"
                                                : ""
                                            }>+</button>
                                    </div>
                                    <div class="item-total">
                                        <strong>${(
                                          item.product.price * item.quantity
                                        ).toFixed(2)} ₺</strong>
                                        <button class="btn btn-sm btn-danger" data-remove="${
                                          item.productId
                                        }">Sil</button>
                                    </div>
                                </div>
                            `
                              )
                              .join("")}
                        </div>
                        <div class="cart-total">
                            <h3>Toplam: ${total.toFixed(2)} ₺</h3>
                        </div>
                    `
                    }
                    <div class="modal-actions">
                        ${
                          cart.length > 0
                            ? '<button class="btn btn-danger" id="clearCartBtn">Sepeti Temizle</button>'
                            : ""
                        }
                        ${
                          cart.length > 0
                            ? '<button class="btn btn-success" id="confirmCartBtn">✓ Sepeti Onayla</button>'
                            : ""
                        }
                        <button class="btn btn-secondary" id="closeBtn">Kapat</button>
                    </div>
                </div>
            </div>
        `;

        
        modal.querySelector(".modal-close").addEventListener("click", closeModal);
        modal.querySelector(".modal-overlay").addEventListener("click", closeModal);
        modal.querySelector("#closeBtn").addEventListener("click", closeModal);

        if (cart.length > 0) {
            
            modal.querySelector("#clearCartBtn").addEventListener("click", async () => {
                const result = await cartService.clearCart();
                if (result.success) {
                    showToast("Sepet temizlendi", "info");
                    updateCounts();
                    updateCartDisplay(); 
                } else {
                    showToast(result.message, "error");
                }
            });

            // Sepeti Onayla
            modal.querySelector("#confirmCartBtn").addEventListener("click", async () => {
                const result = await cartService.confirmCart();
                if (result.success) {
                    showToast(result.message, "success");
                    closeModal(); 
                    renderProducts(); 
                } else {
                    showToast(result.message, "error");
                    if (result.partialSuccess) {
                        updateCartDisplay(); 
                    }
                }
            });
            
            // Miktar Artır
            modal.querySelectorAll("[data-increase]").forEach((btn) => {
                btn.addEventListener("click", async () => {
                    const productId = btn.dataset.increase;
                    const item = cart.find((i) => i.productId == productId);
                    
                    if (!item) {
                        showToast("Ürün sepetinizden kaldırılmış. Sepet güncelleniyor.", "warning");
                        updateCounts();
                        updateCartDisplay();
                        return;
                    }
                    
                    const result = await cartService.updateQuantity(
                        productId,
                        item.quantity + 1
                    );
                    if (result.success) {
                        updateCounts();
                        updateCartDisplay(); 
                    } else {
                        showToast(result.message, "error");
                    }
                });
            });

            // Miktar Azalt
            modal.querySelectorAll("[data-decrease]").forEach((btn) => {
                btn.addEventListener("click", async () => {
                    const productId = btn.dataset.decrease;
                    const item = cart.find((i) => i.productId == productId);
                    
                    if (!item) {
                        showToast("Ürün sepetinizden kaldırılmış. Sepet güncelleniyor.", "warning");
                        updateCounts();
                        updateCartDisplay();
                        return;
                    }

                    if (item.quantity > 1) {
                        const result = await cartService.updateQuantity(
                            productId,
                            item.quantity - 1
                        );
                        if (result.success) {
                            updateCounts();
                            updateCartDisplay(); 
                        }
                    } else {
                        // Miktar 1 ise Silme işlemini yap
                        const result = await cartService.removeFromCart(productId);
                        if (result.success) {
                            showToast("Ürün sepetten çıkarıldı", "info");
                            updateCounts();
                            updateCartDisplay(); 
                        }
                    }
                });
            });

            // Ürün Sil
            modal.querySelectorAll("[data-remove]").forEach((btn) => {
                btn.addEventListener("click", async () => {
                    const productId = btn.dataset.remove;
                    
                    const result = await cartService.removeFromCart(productId);
                    if (result.success) {
                        showToast("Ürün sepetten çıkarıldı", "info");
                        updateCounts();
                        updateCartDisplay(); 
                    }
                });
            });
        }
    };

   
    await updateCartDisplay();
}

  searchInput.addEventListener("input", () => {
    renderProducts();
  });

  categoryFilter.addEventListener("change", renderProducts);

  dashboard
    .querySelector("#viewFavoritesBtn")
    .addEventListener("click", showFavorites);
  dashboard.querySelector("#viewCartBtn").addEventListener("click", showCart);

  await loadCategories();
  await updateCounts();
  await renderProducts();
}
