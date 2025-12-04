import React from 'react';
import './styles/Feature.css';

const Features = () => {
  return (
    <section className="features-section" id="features">
      <div className="features-container">
        <div className="features-header">
          <div className="features-title-wrapper">
            <span className="features-subtitle">Mengapa Memilih Kami</span>
            <h2 className="features-title">Pengalaman Makanan & Minuman Terbaik</h2>
          </div>
          <p className="features-description">
            Temukan apa yang membuat pilihan makanan dan minuman kami berbeda dari yang lain. 
            Kami berkomitmen pada kualitas, kesegaran, dan pengalaman yang menyenangkan di setiap pesanan Anda.
          </p>
        </div>
        
        <div className="features-grid">
          {/* Fitur 1 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="feature-title">Pengiriman Cepat</h3>
            <p className="feature-text">
              Pesanan Anda akan tiba di depan pintu dalam waktu 30 menit atau kurang, dijamin segar dan siap dinikmati.
            </p>
          </div>
          
          {/* Fitur 2 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="feature-title">Bahan Berkualitas</h3>
            <p className="feature-text">
              Kami hanya menggunakan bahan-bahan segar dan berkualitas tinggi dari pemasok lokal terpercaya.
            </p>
          </div>
          
          {/* Fitur 3 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="feature-title">Penawaran Spesial</h3>
            <p className="feature-text">
              Nikmati promo mingguan, paket hemat, dan hadiah loyalitas untuk membuat pengalaman Anda lebih menyenangkan.
            </p>
          </div>
          
          {/* Fitur 4 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="feature-title">Pesanan yang Dapat Disesuaikan</h3>
            <p className="feature-text">
              Sesuaikan makanan dan minuman Anda dengan berbagai pilihan sesuai selera dan kebutuhan diet Anda.
            </p>
          </div>
          
          {/* Fitur 5 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="feature-title">Pembayaran Aman</h3>
            <p className="feature-text">
              Berbagai metode pembayaran dengan sistem keamanan tinggi, termasuk kartu kredit, dompet digital, dan bayar di tempat.
            </p>
          </div>
          
          {/* Fitur 6 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="feature-title">Layanan Pelanggan 24/7</h3>
            <p className="feature-text">
              Tim layanan pelanggan kami siap membantu Anda kapan saja, 24 jam setiap hari.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
