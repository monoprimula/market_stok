import { productService } from './productService.js';

export const cartService = {
    getAll(userId) {
        const carts = JSON.parse(localStorage.getItem('carts') || '{}');
        return carts[userId] || [];
    },

    add(userId, productId, quantity = 1) {
        const carts = JSON.parse(localStorage.getItem('carts') || '{}');
        if (!carts[userId]) {
            carts[userId] = [];
        }

        // Stok kontrolü
        const product = productService.getById(productId);
        if (!product) {
            return { success: false, message: 'Ürün bulunamadı' };
        }

        const existingItem = carts[userId].find(item => item.productId === productId);
        const currentCartQuantity = existingItem ? existingItem.quantity : 0;
        const newTotalQuantity = currentCartQuantity + quantity;

        // Stok miktarını aşamaz
        if (newTotalQuantity > product.stock) {
            return { 
                success: false, 
                message: `Maksimum ${product.stock} adet ekleyebilirsiniz (Sepette ${currentCartQuantity} adet var)` 
            };
        }

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            carts[userId].push({ productId, quantity });
        }

        localStorage.setItem('carts', JSON.stringify(carts));
        return { success: true };
    },

    remove(userId, productId) {
        const carts = JSON.parse(localStorage.getItem('carts') || '{}');
        if (carts[userId]) {
            carts[userId] = carts[userId].filter(item => item.productId !== productId);
            localStorage.setItem('carts', JSON.stringify(carts));
            return true;
        }
        return false;
    },

    updateQuantity(userId, productId, quantity) {
        const carts = JSON.parse(localStorage.getItem('carts') || '{}');
        
        // Stok kontrolü
        const product = productService.getById(productId);
        if (!product) {
            return { success: false, message: 'Ürün bulunamadı' };
        }

        if (quantity > product.stock) {
            return { 
                success: false, 
                message: `Maksimum ${product.stock} adet ekleyebilirsiniz` 
            };
        }

        if (carts[userId]) {
            const item = carts[userId].find(item => item.productId === productId);
            if (item) {
                item.quantity = quantity;
                localStorage.setItem('carts', JSON.stringify(carts));
                return { success: true };
            }
        }
        return { success: false, message: 'Ürün sepette bulunamadı' };
    },

    clear(userId) {
        const carts = JSON.parse(localStorage.getItem('carts') || '{}');
        carts[userId] = [];
        localStorage.setItem('carts', JSON.stringify(carts));
    },

    confirmCart(userId) {
        const carts = JSON.parse(localStorage.getItem('carts') || '{}');
        const cartItems = carts[userId] || [];
        
        if (cartItems.length === 0) {
            return { success: false, message: 'Sepetiniz boş' };
        }

        const errors = [];
        const updatedProducts = [];

        // Her ürün için stok kontrolü ve güncelleme
        for (const item of cartItems) {
            const product = productService.getById(item.productId);
            
            if (!product) {
                errors.push(`${item.productId} ID'li ürün bulunamadı`);
                continue;
            }

            if (product.stock < item.quantity) {
                errors.push(`${product.name} için yeterli stok yok (İstenen: ${item.quantity}, Mevcut: ${product.stock})`);
                continue;
            }

            // Stoktan düş
            const success = productService.update(product.id, {
                ...product,
                stock: product.stock - item.quantity
            });

            if (success) {
                updatedProducts.push({
                    name: product.name,
                    quantity: item.quantity
                });
            }
        }

        if (errors.length > 0) {
            return { 
                success: false, 
                message: 'Bazı ürünler için işlem başarısız:\n' + errors.join('\n'),
                partialSuccess: updatedProducts.length > 0
            };
        }

        // Başarılı ise sepeti temizle
        this.clear(userId);

        return { 
            success: true, 
            message: `Sipariş onaylandı! ${updatedProducts.length} ürün için stok güncellendi.`,
            products: updatedProducts
        };
    }
};