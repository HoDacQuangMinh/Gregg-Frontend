import React, { useState } from 'react';
import '../styles.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleLogin = () => {
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <div className="screen login-screen">
      <div className="login-container">
        <div className="login-box">
          <div className="skull-icon-login">☠️</div>
          <h1 className="login-title">GREGG'S ABYSS</h1>
          <p className="login-subtitle">Master the ancient script or perish</p>
          
          <input
            type="text"
            className="login-input"
            placeholder="Enter your name, warrior"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          
          <button className="btn-login" onClick={handleLogin}>
            ENTER THE ABYSS
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;