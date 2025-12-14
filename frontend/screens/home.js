export function renderHome(container) {
    if (!document.querySelector('link[href="/styles/home.css"]')) {
        const l = document.createElement('link');
        l.rel = 'stylesheet';
        l.href = '/styles/home.css';
        document.head.appendChild(l);
    }

    container.innerHTML = `

    <section class="hero">
        <div class="container">
            <div class="hero-content">
                <div class="hero-text">
                    <h1>Market Stok Yönetimini Tek Panelden Yönetin</h1>
                    <p>Ürünlerinizi takip edin, stok durumunu anlık görün, satış süreçlerinizi kolayca yönetin.</p>
                    <p>Bu uygulama; admin, kullanıcı ve kasiyer rolleri ile market operasyonlarını düzenli, hızlı ve güvenle şekilde yönetmeniz için geliştirilmiştir.</p>
                    <div class="btn-group">
                        <button class="btn btn-primary">Giriş Yap</button>
                        <button class="btn btn-secondary">Özellikleri İncele</button>
                    </div>
                </div>
                <div class="dashboard-preview">
                    <svg width="500" height="350" viewBox="0 0 500 350">
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
                    <p>Ürünlerinizi takip edin ve stokları yönetin.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">💰</div>
                    <h3>Satış Yönetimi</h3>
                    <p>Satış süreçlerinizi düzenli ve kolay şekilde yönetin.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">👥</div>
                    <h3>Rol Bazlı Kullanım</h3>
                    <p>Yöneticiler, personel ve kullanıcı rolleri ile erişim kontrolü.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📊</div>
                    <h3>Raporlama</h3>
                    <p>Raporlama ve analiz için kapsamlı araçlar.</p>
                </div>
            </div>

            <div class="features-grid two-columns">
                <div class="feature-card">
                    <div class="feature-icon">📄</div>
                    <h3>Satış Yönetimi</h3>
                    <p>Satış yönetimini düzenli ve kolay kullanın.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">⚙️</div>
                    <h3>Market İşleri</h3>
                    <p>Ürünlerinizi detaylı şekilde yönetin ve düzenleyin.</p>
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
                        <div class="role-feature">Kullanıcı Yönetimi</div>
                        <div class="role-feature">Ürün Yönetimi</div>
                        <div class="role-feature">Stok Takibi</div>
                        <div class="role-feature">Rol Bazlı Erişim</div>
                        <div class="role-feature">Raporlama</div>
                        <div class="role-feature">Market Yönetimi</div>
                    </div>
                </div>

                <div class="role-card">
                    <div class="role-header user">
                        <span>Kullanıcı 👤</span>
                    </div>
                    <div class="role-features">
                        <div class="role-feature">Stok Takibi</div>
                        <div class="role-feature">Satış İşlemleri</div>
                        <div class="role-feature">Favori Ürünler</div>
                        <div class="role-feature">Sipariş Geçmişi</div>
                    </div>
                </div>

                <div class="role-card">
                    <div class="role-header cashier">
                        <span>Kasiyer 🏪</span>
                    </div>
                    <div class="role-features">
                        <div class="role-feature">Hızlı Satış</div>
                        <div class="role-feature">Stok Güncelleme</div>
                        <div class="role-feature">İade / Fiş İşlemleri</div>
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
                    <h3>Ürünlerinizi takip edin ve stok değerlerini yönetin.</h3>
                    <p>Ürünlerinizi takip edin; günlük stok işlemlerini kolayca yönetin.</p>
                </div>
                <div class="arrow">→</div>
                <div class="step">
                    <div class="step-number">2</div>
                    <h3>Satış süreçlerini yönetin; stok durumunu hızla görüntüleyin.</h3>
                    <p>Satış yönetimini gerçekleştirin; stok durumunu anında kontrol edin.</p>
                </div>
                <div class="arrow">→</div>
                <div class="step">
                    <div class="step-number">3</div>
                    <h3>Marketinizi daha düzenli ve verimli yönetin.</h3>
                    <p>Marketinizi daha düzenli ve verimli hale getirin; operasyonlarınızı iyileştirin.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="cta-section">
        <div class="container">
            <p class="section-subtitle">ALT CTA</p>
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

    // Ripple effect (use CSS class for visuals; only set size/position in JS)
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
            ripple.className = 'ripple';

            if (!this.classList.contains('ripple-parent')) {
                this.classList.add('ripple-parent');
            }

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Navigation
    container.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.hash = '#/login';
        });
    });

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    container.querySelectorAll('.feature-card, .role-card, .step').forEach(el => {
        el.classList.add('will-animate');
        observer.observe(el);
    });
}