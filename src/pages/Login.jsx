import React, { useState } from 'react';
import '../styles.css';

const Login = ({ onLogin, onSignUp, onForgotPassword }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!username.trim()) {
      setError('Please enter your warrior name');
      return;
    }
    setError('');
    onLogin(username.trim());
  };

  return (
    <div className="screen login-screen">
      <div className="login-container">
        <div className="login-box">
          <img src="/images/ui/logo.png" alt="Logo" className="login-logo" />
          <h1 className="login-title">GREGG'S ABYSS</h1>
          <p className="login-subtitle">Master the ancient script or perish</p>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <input
            type="text"
            className="login-input"
            placeholder="Enter your name, warrior"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          
          <input
            type="password"
            className="login-input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          
          <button className="btn-login" onClick={handleLogin}>
            ENTER THE ABYSS
          </button>
          
          <div className="auth-links">
            <button className="btn-text-link" onClick={onForgotPassword}>
              Forgot your password?
            </button>
            <div className="auth-divider">
              <span>New warrior?</span>
            </div>
            <button className="btn-secondary-auth" onClick={onSignUp}>
              CREATE ACCOUNT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;