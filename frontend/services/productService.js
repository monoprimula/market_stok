export const productService = {
    getAll() {
        return JSON.parse(localStorage.getItem('products') || '[]');
    },

    getById(id) {
        const products = this.getAll();
        return products.find(p => p.id === id);
    },

    validate(productData) {
        const errors = [];

        if (!productData.name || productData.name.trim() === '') {
            errors.push('Ürün adı zorunludur');
        }

        if (!productData.barcode || productData.barcode.trim() === '') {
            errors.push('Barkod zorunludur');
        }

        if (!productData.categoryId) {
            errors.push('Kategori seçimi zorunludur');
        }

        if (!productData.price || isNaN(productData.price) || parseFloat(productData.price) < 0) {
            errors.push('Geçerli bir fiyat giriniz');
        }

        if (!productData.stock || isNaN(productData.stock) || parseInt(productData.stock) < 0) {
            errors.push('Geçerli bir stok miktarı giriniz');
        }

        return errors;
    },

    create(productData, createdBy) {
        const errors = this.validate(productData);
        if (errors.length > 0) {
            return { success: false, errors };
        }

        const products = this.getAll();

        const existingBarcode = products.find(p => p.barcode === productData.barcode);
        if (existingBarcode) {
            return { success: false, errors: ['Bu barkod zaten kayıtlı'] };
        }

        const newProduct = {
            id: Date.now().toString(),
            name: productData.name,
            barcode: productData.barcode,
            categoryId: productData.categoryId,
            price: parseFloat(productData.price),
            stock: parseInt(productData.stock),
            createdBy: createdBy || null,
            createdAt: new Date().toISOString()
        };

        products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(products));
        return { success: true, product: newProduct };
    },

    update(id, productData) {
        const errors = this.validate(productData);
        if (errors.length > 0) {
            return { success: false, errors };
        }

        const products = this.getAll();
        const index = products.findIndex(p => p.id === id);

        if (index !== -1) {
            products[index] = {
                ...products[index],
                name: productData.name,
                barcode: productData.barcode,
                categoryId: productData.categoryId,
                price: parseFloat(productData.price),
                stock: parseInt(productData.stock),
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem('products', JSON.stringify(products));
            return { success: true, product: products[index] };
        }
        return { success: false, errors: ['Ürün bulunamadı'] };
    },

    delete(id) {
        const products = this.getAll();
        const filtered = products.filter(p => p.id !== id);
        localStorage.setItem('products', JSON.stringify(filtered));
        return { success: true };
    },

    search(query, categoryId = null) {
        const products = this.getAll();
        let filtered = products;

        if (query && query.trim() !== '') {
            const lowerQuery = query.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(lowerQuery) ||
                p.barcode.includes(query)
            );
        }

        if (categoryId) {
            filtered = filtered.filter(p => p.categoryId === categoryId);
        }

        return filtered;
    },

    getByCreator(userId) {
        const products = this.getAll();
        return products.filter(p => p.createdBy === userId);
    },

    exportToCSV() {
        const products = this.getAll();
        const headers = ['Ürün Adı', 'Barkod', 'Kategori ID', 'Fiyat', 'Stok'];
        const rows = products.map(p => [
            p.name,
            p.barcode,
            p.categoryId,
            p.price,
            p.stock
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `urunler_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    }
};
