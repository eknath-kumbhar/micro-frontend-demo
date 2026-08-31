import React from 'react';

function HeaderSection({ headerComponent: Header, cartCount, user, onNavigate, activeTab }) {
  return (
    <Header
      cartCount={cartCount}
      user={user}
      onNavigate={onNavigate}
      activeTab={activeTab}
    />
  );
}

export default HeaderSection;
