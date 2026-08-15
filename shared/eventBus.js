/**
 * Simple Event Bus for cross-microfrontend communication
 * Works for Host ↔ Remote and Remote ↔ Remote
 */
class EventBus {
  constructor() {
    this.listeners = {};
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    // Return unsubscribe function
    return () => {
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
    };
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => {
        try {
          callback(data);
        } catch (err) {
          console.error(`Error in event listener for "${event}":`, err);
        }
      });
    }
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
    }
  }
}

// Singleton instance
const eventBus = new EventBus();

export default eventBus;

// Common event names (for documentation & consistency)
export const EVENTS = {
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  CLEAR_CART: 'CLEAR_CART',
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
  CART_UPDATED: 'CART_UPDATED',
  USER_UPDATED: 'USER_UPDATED',
  SHOW_NOTIFICATION: 'SHOW_NOTIFICATION',
};
