import React, { Suspense, useEffect, useState } from 'react';
import sharedStore from '../../shared/store';
import eventBus, { EVENTS } from '../../shared/eventBus';

// Lazy load remotes
const Header = React.lazy(() => import('header/Header'));
const Products = React.lazy(() => import('products/Products'));
const Cart = React.lazy(() => import('cart/Cart'));
const UserPanel = React.lazy(() => import('user/UserPanel'));

function NotificationBar() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsub = sharedStore.subscribe((state) => {
      setNotifications(state.notifications);
    });
    return unsub;
  }, []);

  if (notifications.length === 0) return null;

  return (
    <div className="notifications">
      {notifications.map((n) => (
        <div key={n.id} className={`notification ${n.type}`}>
          {n.message}
        </div>
      ))}
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('products');
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);

  // Subscribe to shared store
  useEffect(() => {
    const unsub = sharedStore.subscribe((state) => {
      setCartCount(state.cart.reduce((sum, i) => sum + i.quantity, 0));
      setUser(state.user);
    });

    // Also listen via EventBus (demo of event-based communication)
    const unsubCart = eventBus.on(EVENTS.CART_UPDATED, (cart) => {
      console.log('[Host] Received CART_UPDATED via EventBus', cart);
    });

    return () => {
      unsub();
      unsubCart();
    };
  }, []);

  return (
    <div className="app">
      <NotificationBar />

      {/* Remote: Header */}
      <Suspense fallback={<div className="loading">Loading Header...</div>}>
        <Header
          cartCount={cartCount}
          user={user}
          onNavigate={setActiveTab}
          activeTab={activeTab}
        />
      </Suspense>

      <main className="main">
        <div className="content">
          {activeTab === 'products' && (
            <Suspense fallback={<div className="loading">Loading Products...</div>}>
              <Products />
            </Suspense>
          )}

          {activeTab === 'cart' && (
            <Suspense fallback={<div className="loading">Loading Cart...</div>}>
              <Cart />
            </Suspense>
          )}

          {activeTab === 'user' && (
            <Suspense fallback={<div className="loading">Loading User...</div>}>
              <UserPanel />
            </Suspense>
          )}
        </div>

        {/* Side panel - always show mini cart when items exist */}
        {cartCount > 0 && activeTab !== 'cart' && (
          <aside className="sidebar">
            <Suspense fallback={<div className="loading">Loading Cart...</div>}>
              <Cart mini />
            </Suspense>
          </aside>
        )}
      </main>

      <footer className="footer">
        <p>
          Micro Frontend Demo • Host + 4 Remotes • Shared Store + EventBus
        </p>
        <p className="tech">
          Module Federation • React 18 • KISS Principle
        </p>
      </footer>
    </div>
  );
}

export default App;
