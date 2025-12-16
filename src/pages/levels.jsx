import React from 'react';
import '../styles.css';

const Levels = ({ onSelectLevel, onBack }) => {
  const levelData = [
    { level: 1, name: 'Novice', speed: 'Very Slow', enemies: 5, description: 'Learn the basics' },
    { level: 2, name: 'Warrior', speed: 'Slow', enemies: 8, description: 'Build your skills' },
    { level: 3, name: 'Veteran', speed: 'Medium', enemies: 10, description: 'Test your knowledge' },
    { level: 4, name: 'Master', speed: 'Fast', enemies: 12, description: 'Prove your mastery' },
    { level: 5, name: 'Infernal', speed: 'Very Fast', enemies: 15, description: 'Face the ultimate challenge' },
  ];

  return (
    <div className="screen level-select-screen">
      <div className="level-select-container">
        {/* Return to Main Menu Button */}
        <button className="btn-back-main" onClick={onBack}>
          <span className="btn-back-icon">←</span>
          <span className="btn-back-text">RETURN</span>
        </button>

        <h2 className="level-select-title">SELECT YOUR DOOM</h2>

        <div className="level-grid">
          {levelData.map((data) => (
            <button
              key={data.level}
              className={`level-button ${data.level === 5 ? 'infernal' : ''}`}
              onClick={() => onSelectLevel(data.level)}
            >
              <span className="level-number">{data.level}</span>
              <span className="level-name">{data.name}</span>
              <span className="level-description">{data.description}</span>
            </button>
          ))}
        </div>

        <div className="level-info">
          <p className="info-text">⚙️ Each level increases enemy speed and spawn rate</p>
          <p className="info-text">⚔️ Defeat all enemies to unlock the next level</p>
          <p className="info-text">🎯 Level 1: 5 enemies | Level 5: 15 enemies</p>
        </div>

        <div className="level-details">
          <h3 className="section-title">Level Breakdown:</h3>
          <div className="level-breakdown-grid">
            {levelData.map((data) => (
              <div key={data.level} className="level-detail-card">
                <span className="level-detail-number">{data.level}</span>
                <span className="level-detail-name">{data.name}</span>
                <span className="level-detail-stat">Speed: {data.speed}</span>
                <span className="level-detail-stat">Enemies: {data.enemies}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Levels;