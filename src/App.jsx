import React, { useState } from 'react';
import './styles.css';

// Import page components
import Login from './pages/Login';
import SignUp from './pages/Signup';
import ForgotPassword from './pages/Forgotpassword';
import Menu from './pages/Menu';
import Practice from './pages/Practice';
import Settings from './pages/Settings';
import PhaserGame from './pages/Phasergame';

// Main App Component
export default function App() {
  const [screen, setScreen] = useState('login');
  const [username, setUsername] = useState('');
  const [highScore, setHighScore] = useState(0);
  
  // Game configuration for Phaser
  const [gameConfig, setGameConfig] = useState({
    charType: 'character_1',
    musicOn: true,
    mode: 'gradual',
    manualSpeed: 100,
    manualSpawnTime: 6000
  });

  // Navigation Handlers
  const handleLogin = (name) => {
    setUsername(name);
    setScreen('menu');
  };

  const handleSignUp = (name, email, password) => {
    console.log('Sign up:', { name, email, password });
    setUsername(name);
    setScreen('menu');
  };

  const handleLogout = () => {
    setUsername('');
    setScreen('login');
  };

  // Campaign now goes directly to Phaser game (infinite mode)
  const handleStartCampaign = () => {
    setScreen('game');
  };

  // Practice mode uses your existing practice component
  const handleStartPractice = () => {
    setScreen('practice');
  };

  const handleGameOver = (score) => {
    if (score > highScore) {
      setHighScore(score);
    }
    setScreen('menu');
  };

  const handleBackToMenu = () => {
    setScreen('menu');
  };

  // Update game config (can be called from Settings)
  const handleUpdateConfig = (newConfig) => {
    setGameConfig(prev => ({ ...prev, ...newConfig }));
  };

  return (
    <div className="app-root">
      {/* Login Screen */}
      {screen === 'login' && (
        <Login 
          onLogin={handleLogin}
          onSignUp={() => setScreen('signup')}
          onForgotPassword={() => setScreen('forgot-password')}
        />
      )}

      {/* Sign Up Screen */}
      {screen === 'signup' && (
        <SignUp 
          onSignUp={handleSignUp}
          onBackToLogin={() => setScreen('login')}
        />
      )}

      {/* Forgot Password Screen */}
      {screen === 'forgot-password' && (
        <ForgotPassword 
          onBackToLogin={() => setScreen('login')}
        />
      )}
      
      {/* Main Menu Screen */}
      {screen === 'menu' && (
        <Menu
          onStart={handleStartCampaign}
          onPractice={handleStartPractice}
          onSettings={() => setScreen('settings')}
          onLogout={handleLogout}
          highScore={highScore}
        />
      )}

      {/* Practice Mode */}
      {screen === 'practice' && (
        <Practice
          onBack={handleBackToMenu}
        />
      )}

      {/* Phaser Game (Campaign Mode - Infinite) */}
      {screen === 'game' && (
        <PhaserGame
          gameConfig={gameConfig}
          onGameOver={handleGameOver}
          onExit={handleBackToMenu}
        />
      )}

      {/* Settings Screen */}
      {screen === 'settings' && (
        <Settings 
          onBack={handleBackToMenu}
          gameConfig={gameConfig}
          onUpdateConfig={handleUpdateConfig}
        />
      )}
    </div>
  );
}