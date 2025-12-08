import React, { useState } from 'react';
import '../styles.css';

const Settings = ({ onBack }) => {
  const [musicVolume, setMusicVolume] = useState(50);
  const [sfxVolume, setSfxVolume] = useState(70);
  const [sensitivity, setSensitivity] = useState(5);
  const [difficulty, setDifficulty] = useState('normal');

  const handleReset = () => {
    setMusicVolume(50);
    setSfxVolume(70);
    setSensitivity(5);
    setDifficulty('normal');
  };

  return (
    <div className="screen settings-screen">
      <div className="settings-container">
        <button className="btn-back" onClick={onBack}>← BACK</button>
        
        <h2 className="settings-title">SETTINGS</h2>
        
        <div className="settings-content">
          <div className="settings-section">
            <h3 className="section-title">🔊 AUDIO</h3>
            
            <div className="setting-item">
              <span className="setting-label">Music Volume</span>
              <div className="setting-control">
                <input 
                  type="range" 
                  className="setting-slider" 
                  min="0" 
                  max="100" 
                  value={musicVolume}
                  onChange={(e) => setMusicVolume(e.target.value)}
                />
                <span className="setting-value">{musicVolume}%</span>
              </div>
            </div>
            
            <div className="setting-item">
              <span className="setting-label">Sound Effects</span>
              <div className="setting-control">
                <input 
                  type="range" 
                  className="setting-slider" 
                  min="0" 
                  max="100" 
                  value={sfxVolume}
                  onChange={(e) => setSfxVolume(e.target.value)}
                />
                <span className="setting-value">{sfxVolume}%</span>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h3 className="section-title">✏️ DRAWING</h3>
            
            <div className="setting-item">
              <span className="setting-label">Drawing Sensitivity</span>
              <div className="setting-control">
                <input 
                  type="range" 
                  className="setting-slider" 
                  min="1" 
                  max="10" 
                  value={sensitivity}
                  onChange={(e) => setSensitivity(e.target.value)}
                />
                <span className="setting-value">{sensitivity}/10</span>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h3 className="section-title">🎮 GAMEPLAY</h3>
            
            <div className="setting-item">
              <span className="setting-label">Default Difficulty</span>
              <div className="setting-control">
                <select 
                  className="setting-select"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="easy">Easy</option>
                  <option value="normal">Normal</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h3 className="section-title">ℹ️ ABOUT</h3>
            <div className="about-info">
              <p><strong>Gregg's Abyss</strong></p>
              <p>Version 1.0.0</p>
              <p>A dark fantasy Gregg shorthand learning game</p>
              <p className="credits">Developed by Group 4</p>
            </div>
          </div>

          <div className="settings-actions">
            <button className="btn-reset" onClick={handleReset}>
              Reset to Default
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings