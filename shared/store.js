/**
 * Simple shared store (Zustand-inspired, zero dependency)
 * Used for state that must be shared across Host + Remotes
 *
 * Private state should stay inside each remote with useState.
 */

import eventBus, { EVENTS } from './eventBus';

const initialState = {
  cart: [],          // { id, name, price, quantity }
  user: null,        // { id, name, email } | null
  notifications: [],
};

let state = { ...initialState };
const listeners = new Set();

function getState() {
  return state;
}

function setState(partial) {
  state = { ...state, ...partial };
  listeners.forEach((listener) => listener(state));
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// -------- Cart Actions --------
function addToCart(product) {
  const existing = state.cart.find((item) => item.id === product.id);
  let newCart;

  if (existing) {
    newCart = state.cart.map((item) =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  } else {
    newCart = [...state.cart, { ...product, quantity: 1 }];
  }

  setState({ cart: newCart });
  eventBus.emit(EVENTS.CART_UPDATED, newCart);
  eventBus.emit(EVENTS.SHOW_NOTIFICATION, {
    type: 'success',
    message: `${product.name} added to cart`,
  });
}

function removeFromCart(productId) {
  const newCart = state.cart.filter((item) => item.id !== productId);
  setState({ cart: newCart });
  eventBus.emit(EVENTS.CART_UPDATED, newCart);
}

function updateQuantity(productId, quantity) {
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  const newCart = state.cart.map((item) =>
    item.id === productId ? { ...item, quantity } : item
  );
  setState({ cart: newCart });
  eventBus.emit(EVENTS.CART_UPDATED, newCart);
}

function clearCart() {
  setState({ cart: [] });
  eventBus.emit(EVENTS.CART_UPDATED, []);
}

// -------- User Actions --------
function login(user) {
  setState({ user });
  eventBus.emit(EVENTS.USER_UPDATED, user);
  eventBus.emit(EVENTS.SHOW_NOTIFICATION, {
    type: 'success',
    message: `Welcome, ${user.name}!`,
  });
}

function logout() {
  setState({ user: null });
  eventBus.emit(EVENTS.USER_UPDATED, null);
  eventBus.emit(EVENTS.SHOW_NOTIFICATION, {
    type: 'info',
    message: 'You have been logged out',
  });
}

// -------- Notifications --------
function addNotification(notification) {
  const id = Date.now();
  const newNotifications = [...state.notifications, { ...notification, id }];
  setState({ notifications: newNotifications });

  // Auto remove after 3s
  setTimeout(() => {
    setState({
      notifications: getState().notifications.filter((n) => n.id !== id),
    });
  }, 3000);
}

// Listen to events from remotes and update store
eventBus.on(EVENTS.ADD_TO_CART, addToCart);
eventBus.on(EVENTS.REMOVE_FROM_CART, (id) => removeFromCart(id));
eventBus.on(EVENTS.CLEAR_CART, clearCart);
eventBus.on(EVENTS.USER_LOGIN, login);
eventBus.on(EVENTS.USER_LOGOUT, logout);
eventBus.on(EVENTS.SHOW_NOTIFICATION, addNotification);

export const sharedStore = {
  getState,
  setState,
  subscribe,
  // actions
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  login,
  logout,
};

export default sharedStore;
