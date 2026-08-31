import React from 'react';
import { createRoot } from 'react-dom/client';
import Header from './Header';

// Standalone mode for development
const root = createRoot(document.getElementById('root'));
root.render(
  <Header
    cartCount={2}
    user={{ name: 'Demo User' }}
    onNavigate={() => { }}
    activeTab="products"
  />
);
