import React, { useState } from 'react';
import NotificationBar from './components/NotificationBar';
import useHostState from './hooks/useHostState';
import createRemoteLoader from './remotes/createRemoteLoader';
import { Outlet, useNavigate } from 'react-router';

const Header = createRemoteLoader('Header', () => import('header/Header'));

export default function App() {
  const [activeTab, setActiveTab] = useState('products');
  const { cartCount, user, notifications } = useHostState();

  const navigate = useNavigate();

  return (
    <div className="app">
      <NotificationBar notifications={notifications} />

      <Header
        cartCount={cartCount}
        user={user}
        onNavigate={(tab) => {
          setActiveTab(tab);
          navigate(tab);
        }}
        activeTab={activeTab}
      />

      <main className="main">
        <div className="content">
          <Outlet />
        </div>
      </main>

      <footer className="footer">
        <p>Micro Frontend Demo • Host + 4 Remotes • Shared Store + EventBus</p>
        <p className="tech">Module Federation • React 18</p>
      </footer>
    </div>
  );
}

