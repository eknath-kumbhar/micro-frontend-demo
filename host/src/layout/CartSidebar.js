import React from 'react';

function CartSidebar({ cartCount, cartComponent: Cart }) {
  if (cartCount === 0) {
    return null;
  }

  return (
    <aside className="sidebar">
      <Cart mini />
    </aside>
  );
}

export default CartSidebar;
