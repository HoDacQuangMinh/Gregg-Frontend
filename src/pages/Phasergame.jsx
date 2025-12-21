import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { GameScene } from '../phaser/GameScene';
import '../styles.css';

const PhaserGame = ({ gameConfig, onGameOver, onExit }) => {
  const gameContainer = useRef(null);
  const gameInstance = useRef(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentHealth, setCurrentHealth] = useState(3);
  const [showGameOver, setShowGameOver] = useState(false);
  const [finalStats, setFinalStats] = useState({ score: 0, level: 1 });

  useEffect(() => {
    // Phaser game configuration
    const config = {
      type: Phaser.AUTO,
      parent: gameContainer.current,
      width: 1280,
      height: 720,
      backgroundColor: '#000000',
      dom: {
        createContainer: true
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: [GameScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    // Create Phaser game instance
    gameInstance.current = new Phaser.Game(config);

    // Pass game config from React to Phaser
    gameInstance.current.registry.set('gameConfig', gameConfig);

    // Listen for events from Phaser
    gameInstance.current.events.on('gameStarted', (data) => {
      console.log('Game started:', data);
      setCurrentLevel(data.level);
    });

    gameInstance.current.events.on('scoreUpdate', (data) => {
      setCurrentScore(data.score);
      setCurrentLevel(data.level);
      if (data.health !== undefined) {
        setCurrentHealth(data.health);
      }
    });

    gameInstance.current.events.on('healthUpdate', (data) => {
      setCurrentHealth(data.health);
    });

    gameInstance.current.events.on('levelComplete', (data) => {
      console.log('Level complete:', data);
      setCurrentLevel(data.level + 1);
    });

    gameInstance.current.events.on('gameOver', (data) => {
      console.log('Game over:', data);
      setFinalStats({ score: data.score, level: data.level });
      setShowGameOver(true);
    });

    // Cleanup on unmount
    return () => {
      if (gameInstance.current) {
        gameInstance.current.destroy(true);
        gameInstance.current = null;
      }
    };
  }, [gameConfig]);

  const handleRetry = () => {
    setShowGameOver(false);
    setCurrentScore(0);
    setCurrentLevel(1);
    setCurrentHealth(3);
    
    // Destroy and recreate the game
    if (gameInstance.current) {
      gameInstance.current.destroy(true);
    }

    const config = {
      type: Phaser.AUTO,
      parent: gameContainer.current,
      width: 1280,
      height: 720,
      backgroundColor: '#000000',
      dom: {
        createContainer: true
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: [GameScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    gameInstance.current = new Phaser.Game(config);
    gameInstance.current.registry.set('gameConfig', gameConfig);

    // Re-attach event listeners
    gameInstance.current.events.on('scoreUpdate', (data) => {
      setCurrentScore(data.score);
      setCurrentLevel(data.level);
    });

    gameInstance.current.events.on('healthUpdate', (data) => {
      setCurrentHealth(data.health);
    });

    gameInstance.current.events.on('gameOver', (data) => {
      setFinalStats({ score: data.score, level: data.level });
      setShowGameOver(true);
    });
  };

  const handleExit = () => {
    if (gameInstance.current) {
      gameInstance.current.destroy(true);
      gameInstance.current = null;
    }
    onExit();
  };

  return (
    <div className="screen game-screen phaser-game-screen">
      {/* Retreat Button */}
      <button className="btn-retreat phaser-retreat" onClick={handleExit}>
        ← RETREAT
      </button>

      {/* Phaser Game Container */}
      <div ref={gameContainer} className="phaser-container" />

      {/* Game Over Overlay */}
      {showGameOver && (
        <div className="game-over-overlay">
          <div className="game-over-content">
            <div className="game-over-icon">☠️</div>
            <h2 className="game-over-title">DEFEATED</h2>
            <p className="game-over-score">Final Score: {finalStats.score}</p>
            <p className="game-over-level">Level Reached: {finalStats.level}</p>
            
            <div className="game-over-buttons">
              <button className="btn-game-over" onClick={handleRetry}>
                TRY AGAIN
              </button>
              <button className="btn-game-over secondary" onClick={handleExit}>
                MAIN MENU
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhaserGame;