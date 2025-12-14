export function initializeMockData() {
    if (localStorage.getItem('dataInitialized')) {
        return;
    }

    const mockCategories = [
        { id: '1', name: 'Gıda', description: 'Temel gıda ürünleri', createdAt: new Date().toISOString() },
        { id: '2', name: 'İçecek', description: 'Soğuk ve sıcak içecekler', createdAt: new Date().toISOString() },
        { id: '3', name: 'Temizlik', description: 'Temizlik malzemeleri', createdAt: new Date().toISOString() },
        { id: '4', name: 'Kişisel Bakım', description: 'Kişisel bakım ürünleri', createdAt: new Date().toISOString() },
        { id: '5', name: 'Elektronik', description: 'Elektronik cihazlar', createdAt: new Date().toISOString() }
    ];

    const mockProducts = [
        { id: '1', name: 'Ekmek', barcode: '8690123456789', categoryId: '1', price: 5.50, stock: 45, createdBy: null, createdAt: new Date().toISOString() },
        { id: '2', name: 'Süt 1L', barcode: '8690123456790', categoryId: '1', price: 18.99, stock: 30, createdBy: null, createdAt: new Date().toISOString() },
        { id: '3', name: 'Peynir Beyaz 500g', barcode: '8690123456791', categoryId: '1', price: 95.50, stock: 8, createdBy: null, createdAt: new Date().toISOString() },
        { id: '4', name: 'Coca Cola 1L', barcode: '8690123456792', categoryId: '2', price: 32.50, stock: 60, createdBy: null, createdAt: new Date().toISOString() },
        { id: '5', name: 'Domates 1kg', barcode: '8690123456793', categoryId: '1', price: 25.00, stock: 120, createdBy: null, createdAt: new Date().toISOString() },
        { id: '6', name: 'Çamaşır Deterjanı 3kg', barcode: '8690123456794', categoryId: '3', price: 145.00, stock: 15, createdBy: null, createdAt: new Date().toISOString() },
        { id: '7', name: 'Diş Macunu', barcode: '8690123456795', categoryId: '4', price: 35.50, stock: 25, createdBy: null, createdAt: new Date().toISOString() },
        { id: '8', name: 'Şampuan 500ml', barcode: '8690123456796', categoryId: '4', price: 68.00, stock: 18, createdBy: null, createdAt: new Date().toISOString() },
        { id: '9', name: 'Makarna 500g', barcode: '8690123456797', categoryId: '1', price: 12.50, stock: 5, createdBy: null, createdAt: new Date().toISOString() },
        { id: '10', name: 'Çay 1kg', barcode: '8690123456798', categoryId: '2', price: 125.00, stock: 22, createdBy: null, createdAt: new Date().toISOString() },
        { id: '11', name: 'Pirinç 1kg', barcode: '8690123456799', categoryId: '1', price: 42.00, stock: 35, createdBy: null, createdAt: new Date().toISOString() },
        { id: '12', name: 'Zeytin 500g', barcode: '8690123456800', categoryId: '1', price: 85.00, stock: 12, createdBy: null, createdAt: new Date().toISOString() },
        { id: '13', name: 'Meyve Suyu 1L', barcode: '8690123456801', categoryId: '2', price: 28.50, stock: 40, createdBy: null, createdAt: new Date().toISOString() },
        { id: '14', name: 'Tuvalet Kağıdı 16\'lı', barcode: '8690123456802', categoryId: '3', price: 95.00, stock: 28, createdBy: null, createdAt: new Date().toISOString() },
        { id: '15', name: 'Sabun 6\'lı', barcode: '8690123456803', categoryId: '4', price: 42.00, stock: 3, createdBy: null, createdAt: new Date().toISOString() },
        { id: '16', name: 'Kulaklık Bluetooth', barcode: '8690123456804', categoryId: '5', price: 350.00, stock: 0, createdBy: null, createdAt: new Date().toISOString() }
    ];

    const mockUsers = [
        { id: '1', name: 'Admin Kullanıcı', email: 'admin@market.com', password: '123456', role: 'admin', createdAt: new Date().toISOString() },
        { id: '2', name: 'Personel Kullanıcı', email: 'staff@market.com', password: '123456', role: 'staff', createdAt: new Date().toISOString() },
        { id: '3', name: 'Normal Kullanıcı', email: 'user@market.com', password: '123456', role: 'user', createdAt: new Date().toISOString() }
    ];

    localStorage.setItem('categories', JSON.stringify(mockCategories));
    localStorage.setItem('products', JSON.stringify(mockProducts));
    localStorage.setItem('users', JSON.stringify(mockUsers));
    localStorage.setItem('logs', JSON.stringify([]));
    localStorage.setItem('dataInitialized', 'true');

    console.log('Mock data initialized!');
    console.log('Test hesapları:');
    console.log('Admin: admin@market.com / 123456');
    console.log('Staff: staff@market.com / 123456');
    console.log('User: user@market.com / 123456');
}
