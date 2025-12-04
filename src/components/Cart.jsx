import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import "./styles/Cart.css";

const Cart = () => {
  const { cartItems, cartCount, addToCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  // Hitung total cart (POS: tanpa ongkir & tanpa promo)
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const taxRate = 0.1;
  const taxes = subtotal * taxRate;
  const shippingCost = 0; // POS umumnya tanpa ongkir
  const total = subtotal + taxes + shippingCost;

  // Ubah kuantitas
  const handleQuantityChange = (item, change) => {
    if (item.quantity + change <= 0) {
      removeFromCart(item.id);
    } else {
      addToCart(
        {
          pro_id: item.id,
          pro_name: item.name,
          price: item.price,
          image: item.image
        },
        change
      );
    }
  };

  // Hapus item
  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  // Arahkan ke halaman POS
  const handleCheckoutClick = () => {
    navigate('/pos'); // langsung ke flow POS
  };

  return (
    <section className="cart-section">
      <div className="cart-grid-overlay"></div>
      <div className="cart-glow-orb cart-glow-1"></div>
      <div className="cart-glow-orb cart-glow-2"></div>

      <div className="cart-container">
        <div className="cart-header">
          <h1 className="cart-title">Your Cart</h1>
          <p className="cart-subtitle">
            {cartCount > 0
              ? `You have ${cartCount} ${cartCount === 1 ? 'item' : 'items'} in your cart`
              : 'Your cart is empty'}
          </p>
        </div>

        {cartCount > 0 ? (
          <div className="cart-content">
            <div className="cart-items-container">
              <div className="cart-items-header">
                <div className="header-product">Product</div>
                <div className="header-price">Price</div>
                <div className="header-quantity">Quantity</div>
                <div className="header-total">Total</div>
                <div className="header-actions"></div>
              </div>

              <div className="cart-items-list">
                {cartItems.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <div className="item-product">
                      <div className="item-image">
                        <img
                          src={item.image?.startsWith('http') ? item.image : `http://localhost:8000${item.image}`}
                          alt={item.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                          }}
                        />
                      </div>
                      <div className="item-details">
                        <h3 className="item-name">{item.name}</h3>
                        <Link to={`/products/Rp{item.id}`} className="view-product-link">View product</Link>
                      </div>
                    </div>

                    <div className="item-price" data-label="Price:">Rp{item.price.toFixed(2)}</div>

                    <div className="item-quantity">
                      <div className="quantity-control">
                        <button
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(item, -1)}
                          aria-label="Decrease quantity"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <span className="quantity-display">{item.quantity}</span>
                        <button
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(item, 1)}
                          aria-label="Increase quantity"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="item-total" data-label="Total:">Rp{(item.price * item.quantity).toFixed(2)}</div>

                    <div className="item-actions">
                      <button
                        className="remove-item-btn"
                        onClick={() => handleRemoveItem(item.id)}
                        aria-label="Remove item"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="cart-summary">
              <div className="summary-header">
                <h2>Order Summary</h2>
              </div>

              <div className="summary-content">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>Rp{subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span><span className="free-shipping">FREE</span></span>
                </div>
                <div className="summary-row">
                  <span>Taxes</span>
                  <span>Rp{taxes.toFixed(2)}</span>
                </div>

                <div className="summary-total">
                  <span>Total</span>
                  <span>Rp{total.toFixed(2)}</span>
                </div>

                <button
                  className="checkout-btn"
                  onClick={handleCheckoutClick}
                  aria-label="Proceed to POS"
                  disabled={cartCount === 0}
                >
                  <span>Proses Pembayaran (POS)</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                <p className="security-note">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="security-icon">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>POS Mode. Pembayaran diproses di kasir.</span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
            </div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/products" className="continue-shopping-btn" aria-label="Continue shopping">
              <span>Continue Shopping</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        )}

        <div className="cart-cta">
          <Link to="/products" className="back-to-shopping" aria-label="Back to shopping">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Cart;
