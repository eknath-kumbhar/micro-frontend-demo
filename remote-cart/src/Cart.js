import React, { useEffect, useState } from 'react';
import './Cart.css';

/**
 * Cart Remote
 * - Reads shared cart state from Host
 * - Can update cart (remove / clear) → notifies others via EventBus + store
 * - Supports "mini" mode for sidebar
 */
function Cart({ mini = false }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub = () => { };

    async function init() {
      try {
        const { default: sharedStore } = await import('host/sharedStore');
        setCart(sharedStore.getState().cart);
        unsub = sharedStore.subscribe((state) => setCart(state.cart));
      } catch {
        // Standalone fallback
        console.log('[Cart] Running in standalone mode');
      } finally {
        setLoading(false);
      }
    }

    init();
    return () => unsub();
  }, []);

  const handleRemove = async (id) => {
    try {
      const { default: sharedStore } = await import('host/sharedStore');
      sharedStore.removeFromCart(id);
    } catch {
      console.log('[Cart] Cannot remove in standalone');
    }
  };

  const handleClear = async () => {
    try {
      const { default: sharedStore } = await import('host/sharedStore');
      sharedStore.clearCart();
    } catch {
      console.log('[Cart] Cannot clear in standalone');
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) {
    return <div className="cart loading">Loading cart...</div>;
  }

  if (mini) {
    return (
      <div className="cart mini">
        <h3>🛒 Cart ({cart.reduce((s, i) => s + i.quantity, 0)})</h3>
        {cart.length === 0 ? (
          <p className="empty">Empty</p>
        ) : (
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                <span>
                  {item.name} × {item.quantity}
                </span>
                <button className="link" onClick={() => handleRemove(item.id)}>
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="total">Total: ${total.toFixed(2)}</div>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="cart-header">
        <h2>Shopping Cart</h2>
        <p className="subtitle">Remote: remote-cart (port 3003)</p>
      </div>

      {cart.length === 0 ? (
        <p className="empty">Your cart is empty. Add some products!</p>
      ) : (
        <>
          <ul className="cart-list">
            {cart.map((item) => (
              <li key={item.id} className="cart-item">
                <div className="info">
                  <strong>{item.name}</strong>
                  <span className="meta">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </span>
                </div>
                <div className="actions">
                  <span className="line-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button className="danger" onClick={() => handleRemove(item.id)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-footer">
            <div className="total">Total: ${total.toFixed(2)}</div>
            <button className="secondary" onClick={handleClear}>
              Clear Cart
            </button>
            <button className="primary">Checkout</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
