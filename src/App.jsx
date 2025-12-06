import React, { useState } from 'react';
import './styles.css';

// Import all page components
import Login from './pages/Login';
import Menu from './pages/Menu';
import Practice from './pages/Practice';
import Settings from './pages/Settings';
import Levels from './pages/levels.jsx';
import MainGame from './pages/main';

// Game Over Component
const GameOverScreen = ({ score, level, onRetry, onMenu }) => (
  <div className="game-over-overlay">
    <div className="game-over-content">
      <div className="skull-icon-large">☠️</div>
      <h2 className="game-over-title">DEFEATED</h2>
      <p className="game-over-score">Final Score: {score}</p>
      <p className="game-over-level">Level {level}</p>
      
      <div className="game-over-buttons">
        <button className="btn-game-over" onClick={onRetry}>TRY AGAIN</button>
        <button className="btn-game-over secondary" onClick={onMenu}>MAIN MENU</button>
      </div>
    </div>
  </div>
);

// Main App Component
export default function App() {
  const [screen, setScreen] = useState('login');
  const [username, setUsername] = useState('');
  const [level, setLevel] = useState(1);
  const [gameMode, setGameMode] = useState('campaign');
  const [highScore, setHighScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Navigation Handlers
  const handleLogin = (name) => {
    setUsername(name);
    setScreen('menu');
  };

  const handleLogout = () => {
    setUsername('');
    setScreen('login');
  };

  const handleStartCampaign = () => {
    setScreen('levels');
  };

  const handleStartPractice = () => {
    setGameMode('practice');
    setLevel(1);
    setScreen('practice');
  };

  const handleSelectLevel = (lvl) => {
    setGameMode('campaign');
    setLevel(lvl);
    setScreen('game');
  };

  const handleGameOver = (score) => {
    setFinalScore(score);
    if (score > highScore) {
      setHighScore(score);
    }
    setShowGameOver(true);
  };

  const handleRetry = () => {
    setShowGameOver(false);
    setScreen('game');
  };

  const handleBackToMenu = () => {
    setShowGameOver(false);
    setScreen('menu');
  };

  return (
    <div className="app-root">
      {screen === 'login' && (
        <Login onLogin={handleLogin} />
      )}
      
      {screen === 'menu' && (
        <Menu
          onStart={handleStartCampaign}
          onPractice={handleStartPractice}
          onSettings={() => setScreen('settings')}
          onLogout={handleLogout}
          highScore={highScore}
        />
      )}

      {screen === 'levels' && (
        <Levels
          onSelectLevel={handleSelectLevel}
          onBack={() => setScreen('menu')}
        />
      )}

      {screen === 'practice' && (
        <Practice
          onBack={() => setScreen('menu')}
        />
      )}

      {screen === 'game' && (
        <>
          <MainGame
            level={level}
            setLevel={setLevel}
            onGameOver={handleGameOver}
            onExit={() => setScreen('menu')}
            mode={gameMode}
          />
          {showGameOver && (
            <GameOverScreen
              score={finalScore}
              level={level}
              onRetry={handleRetry}
              onMenu={handleBackToMenu}
            />
          )}
        </>
      )}

      {screen === 'settings' && (
        <Settings onBack={() => setScreen('menu')} />
      )}
    </div>
  );
}