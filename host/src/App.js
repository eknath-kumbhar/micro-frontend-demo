import React, { useState } from 'react';
import NotificationBar from './components/NotificationBar';
import HeaderSection from './layout/HeaderSection';
import ContentArea from './layout/ContentArea';
import CartSidebar from './layout/CartSidebar';
import useHostState from './hooks/useHostState';
import createRemoteLoader from './remotes/createRemoteLoader';

const Header = createRemoteLoader('Header', () => import('header/Header'));
const Products = createRemoteLoader('Products', () => import('products/Products'));
const Cart = createRemoteLoader('Cart', () => import('cart/Cart'));
const UserPanel = createRemoteLoader('User Panel', () => import('user/UserPanel'));

function App() {
  const [activeTab, setActiveTab] = useState('products');
  const { cartCount, user, notifications } = useHostState();

  const contentMap = {
    products: <Products />,
    cart: <Cart />,
    user: <UserPanel />,
  };

  return (
    <div className="app">
      <NotificationBar notifications={notifications} />

      <HeaderSection
        headerComponent={Header}
        cartCount={cartCount}
        user={user}
        onNavigate={setActiveTab}
        activeTab={activeTab}
      />

      <main className="main">
        <ContentArea activeTab={activeTab} contentMap={contentMap} />
        <CartSidebar cartCount={cartCount} cartComponent={Cart} />
      </main>

      <footer className="footer">
        <p>Micro Frontend Demo • Host + 4 Remotes • Shared Store + EventBus</p>
        <p className="tech">Module Federation • React 18</p>
      </footer>
    </div>
  );
}

export default App;
