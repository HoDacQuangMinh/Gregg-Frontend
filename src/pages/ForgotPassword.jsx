import React, { useState } from 'react';
import '../styles.css';

const ForgotPassword = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email');
      return;
    }
    
    setError('');
    setSubmitted(true);
    
    // In a real app, this would send a password reset email
    console.log('Password reset requested for:', email);
  };

  return (
    <div className="screen login-screen">
      <div className="login-container">
        <div className="login-box forgot-password-box">
          <div className="skull-icon-login">🔑</div>
          <h1 className="login-title">RECOVER ACCESS</h1>
          <p className="login-subtitle">Reset your warrior credentials</p>
          
          {!submitted ? (
            <>
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
              
              <p className="forgot-instructions">
                Enter the email address associated with your account and we'll send you a link to reset your password.
              </p>
              
              <input
                type="email"
                className="login-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              />
              
              <button className="btn-login" onClick={handleSubmit}>
                SEND RESET LINK
              </button>
            </>
          ) : (
            <div className="success-message-box">
              <div className="success-icon">✉️</div>
              <h3 className="success-title">Check Your Email</h3>
              <p className="success-text">
                If an account exists with <strong>{email}</strong>, you will receive a password reset link shortly.
              </p>
              <p className="success-note">
                Don't see it? Check your spam folder.
              </p>
            </div>
          )}
          
          <div className="auth-links">
            <button className="btn-text-link" onClick={onBackToLogin}>
              ← Back to <span>Sign In</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;