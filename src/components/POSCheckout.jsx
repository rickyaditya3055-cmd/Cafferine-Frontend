import React, { useEffect, useMemo, useState } from 'react';
import { useCart } from '../CartContext';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
const POSCheckout = () => {
  const { cartItems, cartCount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Calculate totals
  const { subtotal, taxes, total } = useMemo(() => {
    const subtotal = cartItems.reduce((t, i) => t + i.price * i.quantity, 0);
    const taxes = subtotal * 0.1;
    return { subtotal, taxes, total: subtotal + taxes };
  }, [cartItems]);

  // Steps: cart → payment → receipt
  const [currentStep, setCurrentStep] = useState('cart');
  const [paymentMethod, setPaymentMethod] = useState('qris'); // 'qris' | 'cash'

  const [orderId, setOrderId] = useState(null);
  const [orderDate, setOrderDate] = useState(null);

  // QRIS state
  const [qrisImage, setQrisImage] = useState(null);

  const handleCheckout = async () => {
    const tmpId = `POS-${Date.now()}`;
    setOrderId(tmpId);
    setOrderDate(new Date().toISOString());

    if (paymentMethod === 'qris') {
      // Generate QRIS code untuk ditampilkan
      const qrContent = `BRI.QRIS.ID.${tmpId}.${total.toFixed(2)}`;
      const qrImageUrl = "/assets/team/qr.png"; // Placeholder image for demo
      setQrisImage(qrImageUrl);
      setCurrentStep('payment');
    } else {
      // Cash: langsung ke struk
      try {
        await finalizeOrder();
        setCurrentStep('receipt');
      } catch (e) {
        alert(e.message || 'Gagal membuat order');
      }
    }
  };

  // Finalize order - simpan ke backend
  const finalizeOrder = async () => {
    const payload = {
      items: cartItems.map(i => ({ id: i.id, quantity: i.quantity, price: i.price })),
      subtotal: Number(subtotal.toFixed(2)),
      tax: Number(taxes.toFixed(2)),
      shipping: 0,
      discount: 0,
      total: Number(total.toFixed(2)),
      payment_method: paymentMethod,
      payment_ref: null,
      promo_code: '',
      notes: 'POS',
      email: user?.email || null,
      user_id: user?.id || null,
      order_id: orderId,
    };

    try {
      const r = await fetch('http://localhost:8000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!r.ok) {
        const errorData = await r.json();
        throw new Error(errorData.message || 'Gagal membuat order');
      }
      
      const data = await r.json();
      setOrderId(data.data?.order_id || orderId);
      clearCart();
    } catch (error) {
      console.error('Order creation failed:', error);
      // Tetap lanjut untuk demo purposes
      // throw error; // Uncomment untuk production
    }
  };

  // Handler untuk tombol "Saya Sudah Bayar"
  const handlePaymentConfirmed = async () => {
    try {
      await finalizeOrder();
      setCurrentStep('receipt');
    } catch (e) {
      alert(e.message || 'Gagal memproses pembayaran');
    }
  };

  const printReceipt = () => window.print();

  const emailReceipt = async () => {
    try {
      await fetch(`http://localhost:8000/api/orders/${orderId}/send-receipt`, { method: 'POST' });
      alert('Struk dikirim ke email.');
    } catch {
      alert('Gagal mengirim struk.');
    }
  };

  const newTransaction = () => {
    setCurrentStep('cart');
    setPaymentMethod('qris');
    setOrderId(null);
    setOrderDate(null);
    setQrisImage(null);
  };

  const formatTimer = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;

  return (
    <div className="pos-checkout">
      <div className="pos-grid-overlay"></div>
      <div className="pos-glow-orb pos-glow-1"></div>
      <div className="pos-glow-orb pos-glow-2"></div>

      <div className="pos-container">
        <div className="pos-header">
          <h1>🧾 CaffeRine POS</h1>
          <p>Sistem Kasir Digital - Pembayaran QRIS & Struk</p>
        </div>

        <div className="pos-steps">
          <div className={`step ${currentStep==='cart'?'active':''}`}>
            <div className="step-icon">1</div>
            <span>Keranjang</span>
          </div>
          <div className={`step ${currentStep==='payment'?'active':''}`}>
            <div className="step-icon">2</div>
            <span>Pembayaran</span>
          </div>
          <div className={`step ${currentStep==='receipt'?'active':''}`}>
            <div className="step-icon">3</div>
            <span>Struk</span>
          </div>
        </div>

        <div className="pos-content">
          {/* CART VIEW */}
          {currentStep==='cart' && (
            <>
              <div className="cart-items">
                <h2>Daftar Pesanan</h2>
                {cartItems.map(it=>(
                  <div className="cart-item" key={it.id}>
                    <img 
                      src={it.image?.startsWith('http') ? it.image : `http://localhost:8000${it.image}`} 
                      alt={it.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                      }}
                    />
                    <div className="cart-item-info">
                      <div className="cart-item-name">{it.name}</div>
                      <div className="cart-item-quantity">{it.quantity}x @ ${it.price.toFixed(2)}</div>
                    </div>
                    <div className="cart-item-price">${(it.price*it.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div className="order-summary">
                <h3>Ringkasan Pesanan</h3>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Pajak (10%)</span>
                  <span>${taxes.toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="payment-methods">
                {['qris','cash'].map(m=>(
                  <div 
                    key={m} 
                    className={`payment-method ${paymentMethod===m?'active':''}`} 
                    onClick={()=>setPaymentMethod(m)}
                  >
                    <div className="payment-method-icon">
                      {m==='qris'?'📱':'💵'}
                    </div>
                    <div className="payment-method-name">
                      {m==='qris'?'QRIS':'Tunai'}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{textAlign:'center', marginTop: '30px'}}>
                <button 
                  className="btn btn-primary" 
                  onClick={handleCheckout} 
                  disabled={cartCount===0}
                >
                  Proses Pembayaran
                </button>
              </div>
            </>
          )}

          {/* PAYMENT VIEW (QRIS) */}
          {currentStep==='payment' && paymentMethod==='qris' && (
            <div className="qris-container">
              <h2>Scan QRIS untuk Pembayaran</h2>
              
              <div className="order-summary" style={{maxWidth:400, margin:'0 auto 30px'}}>
                <div className="summary-row total">
                  <span>Total Pembayaran</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="qris-code">
                {qrisImage ? (
                  <img src={qrisImage} alt="QRIS Code" />
                ) : (
                  <div className="qris-loading">
                    <div className="loading-spinner"></div>
                    <p>Menyiapkan QR Code...</p>
                  </div>
                )}
              </div>

              <div className="qris-instructions">
                <p><strong>Cara Pembayaran:</strong></p>
                <ol>
                  <li>Buka aplikasi mobile banking atau e-wallet Anda</li>
                  <li>Pilih menu QRIS atau Scan QR</li>
                  <li>Arahkan kamera ke kode QR di atas</li>
                  <li>Konfirmasi pembayaran sebesar ${total.toFixed(2)}</li>
                  <li>Setelah selesai, klik tombol "Saya Sudah Bayar"</li>
                </ol>
              </div>

              <div style={{textAlign:'center', marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap'}}>
                <button 
                  className="btn btn-primary" 
                  onClick={handlePaymentConfirmed}
                  style={{minWidth: '200px'}}
                >
                  ✅ Saya Sudah Bayar
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setCurrentStep('cart')}
                  style={{minWidth: '200px'}}
                >
                  ← Kembali
                </button>
              </div>
            </div>
          )}

          {/* RECEIPT VIEW */}
          {currentStep==='receipt' && (
            <>
              <div className="receipt">
                <div className="receipt-header">
                  <div className="receipt-logo">CaffeRine</div>
                  <div>Manyar Rejo 14, Surabaya</div>
                  <div>Telp: +62 969 420 333</div>
                </div>

                <div className="receipt-info">
                  <div className="receipt-row">
                    <strong>No. Order:</strong>
                    <span>{orderId}</span>
                  </div>
                  <div className="receipt-row">
                    <strong>Tanggal:</strong>
                    <span>{new Date(orderDate).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="receipt-row">
                    <strong>Kasir:</strong>
                    <span>{user?.name || '-'}</span>
                  </div>
                  <div className="receipt-row">
                    <strong>Metode:</strong>
                    <span>{paymentMethod==='qris'?'QRIS':'Tunai'}</span>
                  </div>
                </div>

                <div className="receipt-items">
                  <div className="receipt-items-header">
                    <span>Item</span>
                    <span style={{width:50, textAlign:'center'}}>Qty</span>
                    <span style={{width:100, textAlign:'right'}}>Harga</span>
                  </div>
                  {cartItems.map(it=>(
                    <div className="receipt-item" key={it.id}>
                      <div className="receipt-item-name">{it.name}</div>
                      <div className="receipt-item-qty">{it.quantity}</div>
                      <div className="receipt-item-price">${(it.price*it.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                <div className="receipt-summary">
                  <div className="receipt-row">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="receipt-row">
                    <span>Pajak (10%):</span>
                    <span>${taxes.toFixed(2)}</span>
                  </div>
                  <div className="receipt-row receipt-total">
                    <strong>TOTAL:</strong>
                    <strong>${total.toFixed(2)}</strong>
                  </div>
                </div>

                <div className="receipt-footer">
                  <div className="status-badge success">✓ Pembayaran Berhasil</div>
                  <p>Terima kasih atas pembelian Anda!</p>
                  <p>Simpan struk ini sebagai bukti pembayaran</p>
                  <p style={{marginTop: '20px', fontSize: '12px'}}>www.cafferine.com | @cafferine</p>
                </div>
              </div>

              <div className="receipt-actions">
                <button className="btn btn-outline" onClick={printReceipt}>
                  🖨️ Cetak Struk
                </button>
                <button className="btn btn-outline" onClick={emailReceipt}>
                  📧 Kirim Email
                </button>
              </div>

              <div style={{textAlign:'center', marginTop: '30px'}}>
                <button className="btn btn-primary" onClick={newTransaction}>
                  ➕ Transaksi Baru
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        .pos-checkout {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
          padding: 80px 20px 40px;
          position: relative;
          overflow: hidden;
        }

        .pos-grid-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(0, 245, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 245, 255, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none;
          z-index: 1;
        }

        .pos-glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.3;
          pointer-events: none;
          z-index: 0;
        }

        .pos-glow-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, #00f5ff, transparent);
          top: -200px;
          right: -200px;
        }

        .pos-glow-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, #ff00ea, transparent);
          bottom: -150px;
          left: -150px;
        }

        .pos-container {
          max-width: 1200px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          border: 1px solid rgba(0, 245, 255, 0.2);
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          position: relative;
          z-index: 2;
        }

        .pos-header {
          background: linear-gradient(135deg, #00f5ff 0%, #ff00ea 100%);
          padding: 30px;
          text-align: center;
        }

        .pos-header h1 {
          margin: 0;
          color: #fff;
          font-size: 32px;
          font-weight: 700;
          text-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
        }

        .pos-header p {
          margin: 10px 0 0;
          color: rgba(255, 255, 255, 0.95);
          font-size: 14px;
        }

        .pos-steps {
          display: flex;
          justify-content: space-around;
          padding: 30px;
          background: rgba(0, 0, 0, 0.3);
          border-bottom: 1px solid rgba(0, 245, 255, 0.1);
        }

        .step {
          display: flex;
          align-items: center;
          gap: 10px;
          color: rgba(255, 255, 255, 0.4);
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .step.active {
          color: #00f5ff;
        }

        .step-icon {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          border: 2px solid currentColor;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .step.active .step-icon {
          background: #00f5ff;
          color: #000;
          box-shadow: 0 0 20px rgba(0, 245, 255, 0.5);
        }

        .pos-content {
          padding: 40px;
        }

        .cart-items h2 {
          color: #fff;
          font-size: 24px;
          margin-bottom: 20px;
          font-weight: 600;
        }

        .cart-item {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          margin-bottom: 15px;
          border: 1px solid rgba(0, 245, 255, 0.1);
          transition: all 0.3s ease;
        }

        .cart-item:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(0, 245, 255, 0.3);
          transform: translateX(5px);
        }

        .cart-item img {
          width: 80px;
          height: 80px;
          border-radius: 8px;
          object-fit: cover;
          border: 2px solid rgba(0, 245, 255, 0.2);
        }

        .cart-item-info {
          flex: 1;
        }

        .cart-item-name {
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 5px;
        }

        .cart-item-quantity {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
        }

        .cart-item-price {
          color: #00f5ff;
          font-size: 18px;
          font-weight: 700;
        }

        .order-summary {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 25px;
          margin: 30px 0;
          border: 1px solid rgba(0, 245, 255, 0.1);
        }

        .order-summary h3 {
          color: #fff;
          font-size: 20px;
          margin-bottom: 20px;
          font-weight: 600;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
        }

        .summary-row.total {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 2px solid rgba(0, 245, 255, 0.3);
          font-size: 24px;
          font-weight: 700;
          color: #00f5ff;
        }

        .payment-methods {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 15px;
          margin: 30px 0;
        }

        .payment-method {
          padding: 25px 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(0, 245, 255, 0.2);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }

        .payment-method:hover {
          transform: translateY(-5px);
          border-color: #00f5ff;
          box-shadow: 0 5px 20px rgba(0, 245, 255, 0.3);
          background: rgba(255, 255, 255, 0.08);
        }

        .payment-method.active {
          background: rgba(0, 245, 255, 0.15);
          border-color: #00f5ff;
          box-shadow: 0 0 30px rgba(0, 245, 255, 0.4);
        }

        .payment-method-icon {
          font-size: 40px;
          margin-bottom: 10px;
        }

        .payment-method-name {
          color: #fff;
          font-weight: 600;
          font-size: 16px;
        }

        .qris-container {
          text-align: center;
          padding: 20px;
        }

        .qris-container h2 {
          color: #fff;
          font-size: 24px;
          margin-bottom: 30px;
          font-weight: 600;
        }

        .qris-code {
          width: 320px;
          height: 320px;
          margin: 30px auto;
          background: #fff;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 40px rgba(0, 245, 255, 0.3);
          padding: 10px;
        }

        .qris-code img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .qris-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          color: #666;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(0, 245, 255, 0.1);
          border-top-color: #00f5ff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .qris-instructions {
          color: rgba(255, 255, 255, 0.8);
          margin: 30px auto;
          max-width: 500px;
          text-align: left;
          line-height: 1.8;
        }

        .qris-instructions p {
          text-align: center;
          font-size: 16px;
          margin-bottom: 15px;
        }

        .qris-instructions ol {
          padding-left: 25px;
        }

        .qris-instructions li {
          margin-bottom: 12px;
          font-size: 14px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 25px;
          font-size: 14px;
          font-weight: 600;
          margin: 20px 0;
        }

        .status-badge.success {
          background: rgba(0, 255, 0, 0.2);
          color: #00ff00;
          border: 2px solid #00ff00;
        }

        .receipt {
          max-width: 600px;
          margin: 0 auto;
          background: #fff;
          color: #000;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .receipt-header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px dashed #ccc;
          padding-bottom: 20px;
        }

        .receipt-logo {
          font-size: 32px;
          font-weight: 700;
          background: linear-gradient(135deg, #00f5ff 0%, #ff00ea 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 10px;
        }

        .receipt-header div {
          font-size: 14px;
          color: #666;
          margin: 5px 0;
        }

        .receipt-info {
          margin-bottom: 30px;
        }

        .receipt-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 14px;
        }

        .receipt-items {
          margin-bottom: 30px;
        }

        .receipt-items-header {
          display: flex;
          justify-content: space-between;
          font-weight: 700;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 2px solid #000;
          font-size: 14px;
        }

        .receipt-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
          font-size: 14px;
        }

        .receipt-item-name {
          flex: 1;
        }

        .receipt-item-qty {
          width: 50px;
          text-align: center;
          color: #666;
        }

        .receipt-item-price {
          width: 100px;
          text-align: right;
          font-weight: 600;
        }

        .receipt-summary {
          border-top: 2px solid #000;
          padding-top: 15px;
          margin-top: 20px;
        }

        .receipt-total {
          font-size: 18px;
          font-weight: 700;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px dashed #999;
        }

        .receipt-footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px dashed #ccc;
          color: #666;
          font-size: 13px;
        }

        .receipt-footer p {
          margin: 8px 0;
        }

        .receipt-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-top: 30px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 15px 35px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: inherit;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-primary {
          background: linear-gradient(135deg, #00f5ff 0%, #ff00ea 100%);
          color: #fff;
          box-shadow: 0 5px 20px rgba(0, 245, 255, 0.3);
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 245, 255, 0.5);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          border: 2px solid rgba(0, 245, 255, 0.3);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: #00f5ff;
        }

        .btn-outline {
          background: transparent;
          color: #000;
          border: 2px solid #000;
        }

        .btn-outline:hover {
          background: #000;
          color: #fff;
          transform: translateY(-2px);
        }

        @media print {
          .pos-checkout {
            background: #fff;
            padding: 0;
          }
          
          .pos-grid-overlay,
          .pos-glow-orb,
          .pos-header,
          .pos-steps,
          .receipt-actions,
          .btn {
            display: none !important;
          }
          
          .pos-container {
            box-shadow: none;
            border: none;
            background: #fff;
          }
          
          .receipt {
            box-shadow: none;
            border: none;
            max-width: 100%;
          }
          
          .pos-content {
            padding: 0;
          }
        }

        @media (max-width: 768px) {
          .pos-checkout {
            padding: 60px 10px 20px;
          }
          
          .pos-content {
            padding: 20px;
          }
          
          .pos-header h1 {
            font-size: 24px;
          }
          
          .pos-steps {
            padding: 20px 10px;
          }
          
          .step span {
            display: none;
          }
          
          .cart-item {
            flex-direction: column;
            text-align: center;
          }
          
          .payment-methods {
            grid-template-columns: 1fr;
          }
          
          .qris-code {
            width: 280px;
            height: 280px;
          }
          
          .receipt {
            padding: 20px;
          }
          
          .receipt-actions {
            flex-direction: column;
          }
          
          .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default POSCheckout;