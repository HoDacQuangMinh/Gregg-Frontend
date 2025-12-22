import React, { useState, useEffect } from 'react';
import '../styles.css';

const Settings = ({ onBack, gameConfig, onUpdateConfig }) => {
  const [musicVolume, setMusicVolume] = useState(50);
  const [sfxVolume, setSfxVolume] = useState(70);
  const [sensitivity, setSensitivity] = useState(5);
  
  // Game config settings
  const [selectedChar, setSelectedChar] = useState(gameConfig?.charType || 'character_1');
  const [musicOn, setMusicOn] = useState(gameConfig?.musicOn ?? true);
  const [difficulty, setDifficulty] = useState(gameConfig?.mode || 'gradual');
  const [manualSpeed, setManualSpeed] = useState(gameConfig?.manualSpeed || 100);
  const [manualSpawnTime, setManualSpawnTime] = useState(gameConfig?.manualSpawnTime || 6000);

  // Update parent config when settings change
  useEffect(() => {
    if (onUpdateConfig) {
      onUpdateConfig({
        charType: selectedChar,
        musicOn: musicOn,
        mode: difficulty,
        manualSpeed: manualSpeed,
        manualSpawnTime: manualSpawnTime
      });
    }
  }, [selectedChar, musicOn, difficulty, manualSpeed, manualSpawnTime]);

  const handleReset = () => {
    setMusicVolume(50);
    setSfxVolume(70);
    setSensitivity(5);
    setSelectedChar('character_1');
    setMusicOn(true);
    setDifficulty('gradual');
    setManualSpeed(100);
    setManualSpawnTime(6000);
  };

  return (
    <div className="screen settings-screen">
      <div className="settings-container">
        {/* Clear Back Button */}
        <button className="btn-back-main" onClick={onBack}>
          <span className="btn-back-icon">←</span>
          <span className="btn-back-text">MAIN MENU</span>
        </button>
        
        <h2 className="settings-title">SETTINGS</h2>
        
        <div className="settings-content">
          {/* Character Selection */}
          <div className="settings-section">
            <h3 className="section-title">🧙 CHARACTER</h3>
            <div className="character-selection">
              <div 
                className={`char-option ${selectedChar === 'character_1' ? 'selected' : ''}`}
                onClick={() => setSelectedChar('character_1')}
              >
                <img 
                  src="/assets/player/character_1/idle/idle_01.png" 
                  alt="Mage" 
                  className="char-preview-img"
                />
                <span className="char-name">Mage</span>
              </div>
              <div 
                className={`char-option ${selectedChar === 'character_2' ? 'selected' : ''}`}
                onClick={() => setSelectedChar('character_2')}
              >
                <img 
                  src="/assets/player/character_2/idle/idle_01.png" 
                  alt="Rogue" 
                  className="char-preview-img"
                />
                <span className="char-name">Rogue</span>
              </div>
            </div>
          </div>

          {/* Audio Settings */}
          <div className="settings-section">
            <h3 className="section-title">🔊 AUDIO</h3>
            
            <div className="setting-item">
              <span className="setting-label">Enable Music</span>
              <div className="setting-control">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={musicOn}
                    onChange={(e) => setMusicOn(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
            
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

          {/* Difficulty Settings */}
          <div className="settings-section">
            <h3 className="section-title">🎮 DIFFICULTY</h3>
            
            <div className="setting-item">
              <span className="setting-label">Difficulty Mode</span>
              <div className="setting-control">
                <select 
                  className="setting-select"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="gradual">Gradual (Easy → Hard)</option>
                  <option value="manual">Manual Settings</option>
                </select>
              </div>
            </div>

            {difficulty === 'manual' && (
              <>
                <div className="setting-item">
                  <span className="setting-label">Enemy Speed</span>
                  <div className="setting-control">
                    <input 
                      type="range" 
                      className="setting-slider" 
                      min="50" 
                      max="500" 
                      value={manualSpeed}
                      onChange={(e) => setManualSpeed(parseInt(e.target.value))}
                    />
                    <span className="setting-value">{manualSpeed}</span>
                  </div>
                </div>
                
                <div className="setting-item">
                  <span className="setting-label">Spawn Time (ms)</span>
                  <div className="setting-control">
                    <input 
                      type="range" 
                      className="setting-slider" 
                      min="1000" 
                      max="10000" 
                      step="500"
                      value={manualSpawnTime}
                      onChange={(e) => setManualSpawnTime(parseInt(e.target.value))}
                    />
                    <span className="setting-value">{manualSpawnTime}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Drawing Settings (for Practice Mode) */}
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

          {/* About Section */}
          <div className="settings-section">
            <h3 className="section-title">ℹ️ ABOUT</h3>
            <div className="about-info">
              <p><strong>Gregg's Abyss</strong></p>
              <p>Version 1.0.0</p>
              <p>A fantasy Gregg shorthand learning game</p>
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

export default Settings;