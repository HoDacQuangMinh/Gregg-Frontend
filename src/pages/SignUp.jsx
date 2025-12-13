import React, { useState } from 'react';
import '../styles.css';

const SignUp = ({ onSignUp, onBackToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = () => {
    // Basic validation
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('All fields are required');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email');
      return;
    }
    
    setError('');
    onSignUp(username.trim(), email.trim(), password);
  };

  return (
    <div className="screen login-screen">
      <div className="login-container">
        <div className="login-box signup-box">
          <div className="skull-icon-login">⚔️</div>
          <h1 className="login-title">JOIN THE ABYSS</h1>
          <p className="login-subtitle">Create your warrior account</p>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <input
            type="text"
            className="login-input"
            placeholder="Choose your warrior name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          
          <input
            type="email"
            className="login-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <input
            type="password"
            className="login-input"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <input
            type="password"
            className="login-input"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSignUp()}
          />
          
          <button className="btn-login btn-signup" onClick={handleSignUp}>
            CREATE ACCOUNT
          </button>
          
          <div className="auth-links">
            <button className="btn-text-link" onClick={onBackToLogin}>
              ← Already have an account? <span>Sign In</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;