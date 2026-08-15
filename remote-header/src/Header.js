import React from 'react';
import './Header.css';

/**
 * Header Remote
 * - Receives props from Host (cartCount, user, navigation)
 * - Can also listen to shared events if needed
 */
function Header({ cartCount = 0, user = null, onNavigate, activeTab }) {
  return (
    <header className="mf-header">
      <div className="mf-header-inner">
        <div className="logo" onClick={() => onNavigate?.('products')}>
          🛍️ ShopMF
        </div>

        <nav className="nav">
          <button
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => onNavigate?.('products')}
          >
            Products
          </button>
          <button
            className={activeTab === 'cart' ? 'active' : ''}
            onClick={() => onNavigate?.('cart')}
          >
            Cart
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>
          <button
            className={activeTab === 'user' ? 'active' : ''}
            onClick={() => onNavigate?.('user')}
          >
            {user ? user.name : 'Account'}
          </button>
        </nav>

        <div className="status">
          {user ? (
            <span className="user-chip">👤 {user.name}</span>
          ) : (
            <span className="guest">Guest</span>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
