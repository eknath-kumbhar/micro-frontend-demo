import { useEffect, useState } from 'react';
import sharedStore from '../../../shared/store';
import eventBus, { EVENTS } from '../../../shared/eventBus';

function useHostState() {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubStore = sharedStore.subscribe((state) => {
      setCartCount(state.cart.reduce((sum, item) => sum + item.quantity, 0));
      setUser(state.user);
      setNotifications(state.notifications);
    });

    const unsubCart = eventBus.on(EVENTS.CART_UPDATED, (cart) => {
      console.log('[Host] Received CART_UPDATED via EventBus', cart);
    });

    return () => {
      unsubStore();
      unsubCart();
    };
  }, []);

  return { cartCount, user, notifications };
}

export default useHostState;
