import React from 'react';
import '../styles.css';

const Menu = ({ onStart, onPractice, onSettings, highScore, onLogout }) => {
  return (
    <div className="screen menu-screen">
      <div className="menu-container">
        <div className="menu-header">
          <img 
            src="/images/ui/logo.png" 
            alt="Game Logo" 
            className="menu-logo"
          />
          <h1 className="game-title">GREGG'S ABYSS</h1>
          <p className="game-subtitle">Defend Against the Shorthand Horde</p>
        </div>

        <div className="menu-buttons">
          <button className="btn-menu-primary" onClick={onStart}>
            <span className="btn-icon">⚔️</span>
            <div className="btn-text-content">
              <span className="btn-title">CAMPAIGN</span>
              <span className="btn-desc">5 Levels of Darkness</span>
            </div>
          </button>

          <button className="btn-menu-primary" onClick={onPractice}>
            <span className="btn-icon">📖</span>
            <div className="btn-text-content">
              <span className="btn-title">PRACTICE</span>
              <span className="btn-desc">Endless Training</span>
            </div>
          </button>

          <button className="btn-menu-secondary" onClick={onSettings}>
            ⚙️ SETTINGS
          </button>

          <button className="btn-menu-secondary" onClick={onLogout}>
            🚪 LOGOUT
          </button>

          <div className="high-score-display">
            <span className="high-score-label">BEST SCORE</span>
            <span className="high-score-value">{highScore}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;