import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
const API_BASE = import.meta.env.VITE_API_URL;

export default function Signup() {
  const [storeName, setStoreName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch(`${API_BASE}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        store_name: storeName, 
        email, 
        password 
      })
    });

    const data = await res.json();

    if (res.ok) {
      alert('Store account created successfully! Please login.');
      navigate('/login');
    } else {
      setError(data.error || 'Signup failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Store Account</h2>
        <p>Onboard your store to access dashboard</p>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            className="auth-input"
            placeholder="Store Name"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            required
          />
          <input
            type="email"
            className="auth-input"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="auth-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}