export function renderHome(container) {
    container.innerHTML = `
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
            overflow-x: hidden;
        }
        .hero {
            background: linear-gradient(135deg, #1e5cb8 0%, #2b7de9 100%);
            padding: 80px 20px 100px;
            position: relative;
            overflow: hidden;
        }
        .hero::before {
            content: '';
            position: absolute;
            width: 600px;
            height: 600px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 50%;
            top: -200px;
            right: -200px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            position: relative;
            z-index: 1;
        }
        .hero-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 60px;
            align-items: center;
        }
        .hero-text h1 {
            color: white;
            font-size: 42px;
            font-weight: 700;
            margin-bottom: 20px;
            line-height: 1.2;
        }
        .hero-text p {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .btn-group {
            display: flex;
            gap: 15px;
        }
        .btn {
            padding: 12px 30px;
            border-radius: 8px;
            border: none;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .btn-primary {
            background: white;
            color: #1e5cb8;
        }
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        .btn-secondary {
            background: transparent;
            color: white;
            border: 2px solid white;
        }
        .btn-secondary:hover {
            background: white;
            color: #1e5cb8;
        }
        .dashboard-preview {
            position: relative;
            animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
            0%, 100% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-20px);
            }
        }
        .section {
            padding: 80px 20px;
        }
        .section-title {
            text-align: center;
            margin-bottom: 60px;
        }
        .section-subtitle {
            color: #666;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 15px;
        }
        .section-title h2 {
            font-size: 36px;
            color: #1a1a1a;
            margin-bottom: 15px;
        }
        .section-title p {
            color: #666;
            font-size: 16px;
            max-width: 600px;
            margin: 0 auto;
        }
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
            margin-bottom: 60px;
        }
        .feature-card {
            background: white;
            padding: 40px 30px;
            border-radius: 12px;
            text-align: center;
            transition: all 0.3s ease;
            border: 1px solid #f0f0f0;
        }
        .feature-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
        }
        .feature-icon {
            width: 70px;
            height: 70px;
            background: linear-gradient(135deg, #2b7de9 0%, #1e5cb8 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 25px;
            font-size: 32px;
            color: white;
        }
        .feature-card h3 {
            font-size: 20px;
            margin-bottom: 15px;
            color: #1a1a1a;
        }
        .feature-card p {
            color: #666;
            font-size: 14px;
            line-height: 1.6;
        }
        .roles-section {
            background: #f8f9fa;
        }
        .roles-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
        }
        .role-card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
        }
        .role-header {
            padding: 25px;
            color: white;
            text-align: center;
            font-weight: 600;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        .role-header.admin {
            background: linear-gradient(135deg, #2b7de9 0%, #1e5cb8 100%);
        }
        .role-header.user {
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
        }
        .role-header.cashier {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }
        .role-features {
            padding: 25px;
        }
        .role-feature {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 0;
            color: #555;
            font-size: 14px;
        }
        .role-feature::before {
            content: '✓';
            width: 24px;
            height: 24px;
            background: #f0f0f0;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: #2b7de9;
            flex-shrink: 0;
        }
        .steps-section {
            background: white;
        }
        .steps-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 40px;
            margin-bottom: 40px;
            flex-wrap: wrap;
        }
        .step {
            text-align: center;
            max-width: 250px;
            flex: 1;
            min-width: 200px;
        }
        .step-number {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #2b7de9 0%, #1e5cb8 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 24px;
            font-weight: bold;
            color: white;
        }
        .step h3 {
            font-size: 16px;
            margin-bottom: 10px;
            color: #1a1a1a;
        }
        .step p {
            font-size: 14px;
            color: #666;
            line-height: 1.5;
        }
        .arrow {
            font-size: 24px;
            color: #ddd;
            flex-shrink: 0;
        }
        .cta-section {
            background: linear-gradient(135deg, #1e5cb8 0%, #2b7de9 100%);
            color: white;
            text-align: center;
            padding: 80px 20px;
        }
        .cta-section h2 {
            font-size: 36px;
            margin-bottom: 20px;
        }
        .cta-section .btn {
            margin-top: 30px;
            padding: 15px 40px;
            font-size: 16px;
        }
        .footer {
            background: #1a1a1a;
            color: white;
            text-align: center;
            padding: 30px 20px;
            font-size: 14px;
        }
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        @media (max-width: 968px) {
            .hero-content {
                grid-template-columns: 1fr;
                text-align: center;
            }
            .btn-group {
                justify-content: center;
            }
            .roles-grid {
                grid-template-columns: 1fr;
            }
            .steps-container {
                flex-direction: column;
            }
            .arrow {
                transform: rotate(90deg);
            }
            .hero-text h1 {
                font-size: 32px;
            }
        }
    </style>

    <section class="hero">
        <div class="container">
            <div class="hero-content">
                <div class="hero-text">
                    <h1>Market Stok Yönetimini Tek Panelden Yönetin</h1>
                    <p>Ürünlerinizi takip edin, stok durumunu anık görün, satış süreçlerinizi kolayca yönetin.</p>
                    <p>Bu uygulama; admin, kullanıcı ve kasiyer rolleri ile market operasyonlarını düzenli, hızlı ve güvenle şekilde yönetmeniz için geliştirilmiştir.</p>
                    <div class="btn-group">
                        <button class="btn btn-primary">Giriş Yap</button>
                        <button class="btn btn-secondary">Özellikleri İncele</button>
                    </div>
                </div>
                <div class="dashboard-preview">
                    <svg width="500" height="350" viewBox="0 0 500 350" style="background: white; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                        <rect width="500" height="50" fill="#1e5cb8"/>
                        <text x="20" y="32" fill="white" font-size="18" font-weight="bold">Market Dashboard</text>
                        <circle cx="80" cy="120" r="40" fill="#e3f2fd"/>
                        <text x="80" y="125" text-anchor="middle" font-size="24">📊</text>
                        <text x="80" y="170" text-anchor="middle" font-size="12" font-weight="bold">Stok Takibi</text>
                        <rect x="150" y="80" width="150" height="100" rx="8" fill="#f5f5f5"/>
                        <rect x="160" y="90" width="50" height="8" rx="4" fill="#ddd"/>
                        <rect x="160" y="110" width="70" height="30" rx="4" fill="#2b7de9"/>
                        <rect x="240" y="110" width="50" height="40" rx="4" fill="#4ade80"/>
                        <circle cx="380" cy="130" r="50" fill="#e3f2fd" opacity="0.3"/>
                        <circle cx="380" cy="130" r="35" fill="#2b7de9" opacity="0.5"/>
                        <circle cx="380" cy="130" r="20" fill="#1e5cb8"/>
                        <rect x="40" y="220" width="420" height="100" rx="8" fill="#f8f9fa"/>
                        <rect x="60" y="240" width="180" height="12" rx="6" fill="#ddd"/>
                        <rect x="60" y="260" width="140" height="12" rx="6" fill="#ddd"/>
                        <rect x="60" y="280" width="160" height="12" rx="6" fill="#ddd"/>
                    </svg>
                </div>
            </div>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <div class="section-title">
                <p class="section-subtitle">UYGULAMA HAKKINDA KISA TANITIM</p>
                <h2>Marketler için Akıllı Stok Çözümü</h2>
                <p>Bu uygulama; admin, kullanıcı ve kasiyer rolleri ile market operasyonlarını düzenli, hızlı ve güvenle şekilde yönetmeniz için geliştirilmiştir.</p>
            </div>

            <div class="section-title">
                <p class="section-subtitle">ÖZELLİKLER BÖLÜMÜ</p>
            </div>

            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">📦</div>
                    <h3>Stok Takibi</h3>
                    <p>Ürünlerinizi takip edin, ve stok yönetin.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">💰</div>
                    <h3>Satış Yönetimi</h3>
                    <p>Satış alanını, stok giriş, satış işlemlerini kolayca yönetin.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">👥</div>
                    <h3>Rol Bazlı Kullanım</h3>
                    <p>Yöneticiler, admin, alt ve tek kullanıcı rolleri.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📊</div>
                    <h3>Raporlama</h3>
                    <p>Raporlama ve vanak için rapor ve raporlama.</p>
                </div>
            </div>

            <div class="features-grid" style="grid-template-columns: repeat(2, 1fr);">
                <div class="feature-card">
                    <div class="feature-icon">📄</div>
                    <h3>Satış Yönetimi</h3>
                    <p>Satış yönetimi satış düzenli kullanın.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">⚙️</div>
                    <h3>Market İşeri</h3>
                    <p>Ürünlerinizi takip kullanan ne ve detaylı yönetin.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="section roles-section">
        <div class="container">
            <div class="section-title">
                <p class="section-subtitle">KULLANICI ROLLERİ BÖLÜMÜ</p>
                <h2>Kimler İçin Uygun?</h2>
            </div>

            <div class="roles-grid">
                <div class="role-card">
                    <div class="role-header admin">
                        <span>Admin 👑</span>
                    </div>
                    <div class="role-features">
                        <div class="role-feature">Admin Takibi</div>
                        <div class="role-feature">Ürünlerin Takibi</div>
                        <div class="role-feature">Ürünlerin Takibi</div>
                        <div class="role-feature">Rol Bazlı Kullanım</div>
                        <div class="role-feature">Rol Bazlı Kullanım Yönetimi</div>
                        <div class="role-feature">Market Yönetimi</div>
                        <div class="role-feature">Raporlama</div>
                        <div class="role-feature">Raporlama</div>
                        <div class="role-feature">Raporlara</div>
                    </div>
                </div>

                <div class="role-card">
                    <div class="role-header user">
                        <span>Kullanıcı 👤</span>
                    </div>
                    <div class="role-features">
                        <div class="role-feature">Stok Takibi</div>
                        <div class="role-feature">Satış Yönetimi</div>
                        <div class="role-feature">Kullanıcı Satış</div>
                        <div class="role-feature">Rol Kullanıcı</div>
                        <div class="role-feature">Kasiyer Kullanıcı</div>
                    </div>
                </div>

                <div class="role-card">
                    <div class="role-header cashier">
                        <span>Kasiyer 🏪</span>
                    </div>
                    <div class="role-features">
                        <div class="role-feature">Kasiyer Kasser</div>
                        <div class="role-feature">Ürünler Kasiyer</div>
                        <div class="role-feature">Kasiyer Kullanıcı</div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="section steps-section">
        <div class="container">
            <div class="section-title">
                <p class="section-subtitle">NASIL ÇALIŞIR?</p>
            </div>

            <div class="steps-container">
                <div class="step">
                    <div class="step-number">1</div>
                    <h3>Ürünlerinizi takip edin, stok değerini yönetin, yönetin.</h3>
                    <p>Ürünlerinizi takip edin, stoktan günlük işlemler dahil yönetin.</p>
                </div>
                <div class="arrow">→</div>
                <div class="step">
                    <div class="step-number">2</div>
                    <h3>Satış yönetimi olaylar, stok durumunu hızlı kasiyer</h3>
                    <p>Satış yönetimi olaylar, stok durumunu hızlı kasiyer etmenitelerinizi işitemeniz.</p>
                </div>
                <div class="arrow">→</div>
                <div class="step">
                    <div class="step-number">3</div>
                    <h3>Marketinizi daha düzenli ve verimli yönetin, gerçita ve verimli getirin.</h3>
                    <p>Marketinizi daha düzenli ve verimli yönetin, gerçita ve verimli getirin.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="cta-section">
        <div class="container">
            <p class="section-subtitle" style="color: rgba(255,255,255,0.8);">ALT CTA</p>
            <h2>Marketinizi daha düzenli ve kontrollü yönetin.</h2>
            <button class="btn btn-primary">⚡ Giriş Yap</button>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <p>Market Stok Yönetim Sistemi</p>
            <p>© 2025 Tüm haklar saklıdır.</p>
        </div>
    </footer>
    `;


    container.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255,255,255,0.6)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s ease-out';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });


    container.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.hash = '#/login';
        });
    });


    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    container.querySelectorAll('.feature-card, .role-card, .step').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}