# Market Stok Yönetim Sistemi

Bu proje, market stoklarını takip etmek ve yönetmek için geliştirilmiş bir web uygulamasıdır. Backend Node.js ve Express.js ile, frontend ise Vanilla JavaScript ve Vite ile geliştirilmiştir. Veritabanı olarak MySQL kullanılmaktadır.

## Özellikler

- Kullanıcı yönetimi (Admin, Personel, Müşteri rolleri)
- Ürün ve kategori yönetimi
- Stok takibi ve işlemleri
- Favori ürünler
- Sepet ve sipariş yönetimi
- Raporlama sistemi
- Güvenli kimlik doğrulama (JWT)

## Gereksinimler

- Node.js (v16 veya üzeri)
- MySQL Server
- npm veya yarn

## Kurulum

### 1. Projeyi Klonlayın

```bash
git clone <repository-url>
cd market_stok
```

### 2. Backend Kurulumu

```bash
cd backend
npm install
```

### 3. Frontend Kurulumu

```bash
cd ../frontend
npm install
```

### 4. Veritabanı Kurulumu

1. MySQL sunucunuzu başlatın
2. Aşağıdaki SQL komutlarını çalıştırarak veritabanını oluşturun:

```sql
CREATE DATABASE market_stok;
```

3. Backend klasöründe `.env` dosyası oluşturun. Örnek olarak `backend/.env.example` dosyasını kullanabilirsiniz:

```bash
cp backend/.env.example backend/.env
```

Ardından `.env` dosyasındaki değerleri kendi veritabanı bilgilerinizle güncelleyin:

```env
DB_HOST=localhost
DB_USER=kullanici_adi
DB_PASS=sifre
DB_NAME=market_stok
PORT=3000
JWT_SECRET=sizin_jwt_secret_anahtarinizi_buraya_yazin
```

**Not:** `JWT_SECRET` için güçlü bir rastgele anahtar kullanın.

### 5. Veritabanı Tablolarını Oluşturun

Backend klasöründe aşağıdaki komutu çalıştırarak Sequelize modellerini senkronize edin:

```bash
cd backend
npx sequelize-cli db:migrate
```

(Eğer migration dosyaları yoksa, modelleri manuel olarak oluşturmanız gerekebilir.)

## Çalıştırma

### Backend'i Başlatın

```bash
cd backend
npm start
```

Backend http://localhost:3000 adresinde çalışacaktır.

### Frontend'i Başlatın

Yeni bir terminal açın ve:

```bash
cd frontend
npm run dev
```

Frontend http://localhost:5173 adresinde çalışacaktır.

## Kullanım

1. Tarayıcınızda http://localhost:5173 adresine gidin
2. Kayıt olun veya giriş yapın
3. Uygulamayı kullanmaya başlayın

## API Dokümantasyonu

### Ana Endpoint'ler

- `GET /` - API durum kontrolü
- `POST /api/auth/login` - Giriş
- `POST /api/auth/register` - Kayıt
- `GET /api/products` - Ürünleri listele
- `GET /api/categories` - Kategorileri listele
- `POST /api/orders` - Sipariş oluştur
- `GET /api/reports` - Raporlar

Daha detaylı API dokümantasyonu için kod içindeki route dosyalarına bakın.

## Kullanıcı Rolleri

- **Admin**: Tüm yetkiler (ürün yönetimi, raporlar, kullanıcı yönetimi)
- **Personel**: Ürün ve stok yönetimi
- **Müşteri**: Alışveriş yapma, favoriler, sipariş geçmişi

## Geliştirme

### Backend Scripts

```bash
npm test  # Testler (henüz tanımlanmamış)
```

### Frontend Scripts

```bash
npm run dev      # Geliştirme sunucusu
npm run build    # Üretim için build
npm run preview  # Build önizlemesi
```

## Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Lisans

Bu proje ISC lisansı altında lisanslanmıştır.