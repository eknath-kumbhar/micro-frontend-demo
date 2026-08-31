import React, { useState } from 'react';
import './Products.css';

// Sample product data (private to this remote)
const PRODUCTS = [
  { id: 1, name: 'Wireless Headphones', price: 79.99, emoji: '🎧', category: 'Audio' },
  { id: 2, name: 'Smart Watch', price: 149.99, emoji: '⌚', category: 'Wearables' },
  { id: 3, name: 'Laptop Stand', price: 39.99, emoji: '💻', category: 'Accessories' },
  { id: 4, name: 'Mechanical Keyboard', price: 89.99, emoji: '⌨️', category: 'Accessories' },
  { id: 5, name: 'USB-C Hub', price: 49.99, emoji: '🔌', category: 'Accessories' },
  { id: 6, name: 'Bluetooth Speaker', price: 59.99, emoji: '🔊', category: 'Audio' },
];

/**
 * Products Remote
 * - Has private state (search, filter)
 * - Communicates with Host/Cart via EventBus (ADD_TO_CART)
 * - Can also import sharedStore from host when running inside host
 */
function Products() {
  // Private state – only this remote cares about search/filter
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = ['All', ...new Set(PRODUCTS.map((p) => p.category))];

  const filtered = PRODUCTS.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || p.category === category;
    return matchSearch && matchCat;
  });

  const handleAddToCart = async (product) => {
    // Try to use shared store from host (when federated)
    // Fallback: use EventBus (works in both standalone & federated)
    try {
      const { default: sharedStore } = await import('host/sharedStore');
      sharedStore.addToCart(product);
    } catch {
      // Standalone mode or EventBus fallback
      const { default: eventBus, EVENTS } = await import('host/eventBus').catch(() => {
        // Ultimate fallback for pure standalone
        console.log('[Products] Standalone mode – would add:', product);
        return { default: { emit: () => { } }, EVENTS: {} };
      });
      eventBus.emit(EVENTS.ADD_TO_CART || 'ADD_TO_CART', product);
    }
  };

  return (
    <div className="products">
      <div className="products-header">
        <h2>Products</h2>
        <p className="subtitle">Remote: remote-products (port 3002)</p>
      </div>

      {/* Private UI state */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="categories">
          {categories.map((cat) => (
            <button
              key={cat}
              className={category === cat ? 'active' : ''}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="product-grid">
        {filtered.map((product) => (
          <div key={product.id} className="product-card">
            <div className="emoji">{product.emoji}</div>
            <h3>{product.name}</h3>
            <p className="category">{product.category}</p>
            <p className="price">${product.price.toFixed(2)}</p>
            <button className="primary" onClick={() => handleAddToCart(product)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="empty">No products match your filters.</p>
      )}
    </div>
  );
}

export default Products;
