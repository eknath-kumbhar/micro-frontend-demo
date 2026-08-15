import React, { useEffect, useState } from 'react';
import './UserPanel.css';

/**
 * User Remote
 * - Manages login/logout
 * - Updates shared user state (visible in Header immediately)
 * - Demonstrates remote → host and remote → remote communication
 */
function UserPanel() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // Private state
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let unsub = () => {};

    async function init() {
      try {
        const { default: sharedStore } = await import('host/sharedStore');
        setUser(sharedStore.getState().user);
        unsub = sharedStore.subscribe((state) => setUser(state.user));
      } catch {
        console.log('[User] Standalone mode');
      }
    }

    init();
    return () => unsub();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);

    const userData = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s/g, '')}@example.com`,
    };

    try {
      const { default: sharedStore } = await import('host/sharedStore');
      sharedStore.login(userData);
    } catch {
      console.log('[User] Login in standalone:', userData);
      setUser(userData);
    }

    setName('');
    setEmail('');
    setIsSubmitting(false);
  };

  const handleLogout = async () => {
    try {
      const { default: sharedStore } = await import('host/sharedStore');
      sharedStore.logout();
    } catch {
      setUser(null);
    }
  };

  return (
    <div className="user-panel">
      <div className="user-header">
        <h2>Account</h2>
        <p className="subtitle">Remote: remote-user (port 3004)</p>
      </div>

      {user ? (
        <div className="profile">
          <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
          <h3>{user.name}</h3>
          <p className="email">{user.email}</p>
          <p className="note">
            This user info is shared. Check the Header – it updates instantly
            (Host ← Remote communication via shared store).
          </p>
          <button className="danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <form className="login-form" onSubmit={handleLogin}>
          <p className="note">
            Login here and watch the Header update in real-time.
          </p>
          <div className="field">
            <label>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              required
            />
          </div>
          <div className="field">
            <label>Email (optional)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
            />
          </div>
          <button className="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      )}
    </div>
  );
}

export default UserPanel;
