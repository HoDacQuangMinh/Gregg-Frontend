import React from 'react';
import '../styles.css';

const Levels = ({ onSelectLevel, onBack }) => {
  const levels = [
    { 
      number: 1, 
      name: 'NOVICE', 
      description: 'Learn the basics',
      speed: 'Very Slow',
      enemies: 5
    },
    { 
      number: 2, 
      name: 'WARRIOR', 
      description: 'Build your skills',
      speed: 'Slow',
      enemies: 8
    },
    { 
      number: 3, 
      name: 'VETERAN', 
      description: 'Test your knowledge',
      speed: 'Medium',
      enemies: 10
    },
    { 
      number: 4, 
      name: 'MASTER', 
      description: 'Prove your mastery',
      speed: 'Fast',
      enemies: 12
    },
    { 
      number: 5, 
      name: 'INFERNAL', 
      description: 'Face the ultimate challenge',
      speed: 'Very Fast',
      enemies: 15
    }
  ];

  return (
    <div className="screen level-select-screen">
      <div className="level-select-container">
        <button className="btn-back" onClick={onBack}>← BACK</button>
        
        <h2 className="level-select-title">SELECT YOUR DOOM</h2>
        
        <div className="level-grid">
          {levels.map((level) => (
            <button
              key={level.number}
              className={`level-button ${level.number === 5 ? 'infernal' : ''}`}
              onClick={() => onSelectLevel(level.number)}
            >
              <div className="level-number">{level.number}</div>
              <div className="level-name">{level.name}</div>
              <div className="level-description">{level.description}</div>
            </button>
          ))}
        </div>

        <div className="level-info">
          <p className="info-text">
            💀 Each level increases enemy speed and spawn rate
          </p>
          <p className="info-text">
            ⚔️ Defeat all enemies to unlock the next level
          </p>
          <p className="info-text">
            🎯 Level 1: 5 enemies | Level 5: 15 enemies
          </p>
        </div>

        <div className="level-details">
          <h3 className="section-title">Level Breakdown:</h3>
          <div className="level-breakdown-grid">
            {levels.map((level) => (
              <div key={level.number} className="level-detail-card">
                <div className="level-detail-number">{level.number}</div>
                <div className="level-detail-info">
                  <div className="level-detail-name">{level.name}</div>
                  <div className="level-detail-stat">Speed: {level.speed}</div>
                  <div className="level-detail-stat">Enemies: {level.enemies}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Levels;