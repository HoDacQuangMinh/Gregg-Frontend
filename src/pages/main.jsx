import React, { useState, useEffect, useRef } from 'react';
import '../styles.css'; 
// Gregg Words Data
const GREGG_WORDS = [
  { word: 'the', shape: 'curve-right', imagePath: '/images/glyphs/the.png' },
  { word: 'and', shape: 'loop', imagePath: '/images/glyphs/and.png' },
  { word: 'for', shape: 'hook', imagePath: '/images/glyphs/for.png' },
  { word: 'you', shape: 'wave', imagePath: '/images/glyphs/you.png' },
  { word: 'are', shape: 'circle', imagePath: '/images/glyphs/are.png' },
  { word: 'that', shape: 'curve-left', imagePath: '/images/glyphs/that.png' },
  { word: 'with', shape: 'diagonal', imagePath: '/images/glyphs/with.png' },
  { word: 'have', shape: 'hook-down', imagePath: '/images/glyphs/have.png' }
];

// HUD Component
const GameHUD = ({ level, score, health, mode, enemiesDefeated, enemiesRequired }) => (
  <div className="game-hud">
    <div className="hud-section">
      <span className="hud-label">LEVEL</span>
      <span className="hud-value text-glow-gold">{level}</span>
    </div>

    <div className="hud-center">
      <div className="shield-icon-mini"></div>
      <span className="hud-score">{score}</span>
    </div>

    <div className="hud-section">
      <span className="hud-label">HEALTH</span>
      <div className="health-bar-container">
        <div className="health-bar">
          <div 
            className="health-bar-fill" 
            style={{ width: `${health}%` }}
          />
        </div>
        <span className="health-text">{health}%</span>
      </div>
    </div>
  </div>
);

// Enemy Component
const Enemy = ({ enemy, onDefeat }) => {
  return (
    <div
      className="floating-enemy"
      style={{
        left: `${enemy.x}%`,
        top: `${enemy.y}%`,
      }}
      onClick={() => onDefeat(enemy)}
    >
      <div className="enemy-skull">☠️</div>
      <div className="enemy-word-display">{enemy.word}</div>
      <div className="enemy-shape-hint">{enemy.shape}</div>
    </div>
  );
};

// Main Game Component
const MainGame = ({ level, setLevel, onGameOver, onExit, mode }) => {
  const [enemies, setEnemies] = useState([]);
  const [activeEnemy, setActiveEnemy] = useState(null);
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);
  const [enemiesDefeated, setEnemiesDefeated] = useState(0);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const spawnTimerRef = useRef(0);
  const lastTimeRef = useRef();

  // Level configurations
  const levelConfig = {
    1: { speed: 0.3, spawnRate: 4000, enemiesRequired: 5 },
    2: { speed: 0.5, spawnRate: 3500, enemiesRequired: 8 },
    3: { speed: 0.8, spawnRate: 3000, enemiesRequired: 10 },
    4: { speed: 1.2, spawnRate: 2500, enemiesRequired: 12 },
    5: { speed: 1.8, spawnRate: 2000, enemiesRequired: 15 }
  };

  const config = levelConfig[level] || levelConfig[1];

  const spawnEnemy = () => {
    const randomWord = GREGG_WORDS[Math.floor(Math.random() * GREGG_WORDS.length)];
    const newEnemy = {
      id: Date.now() + Math.random(),
      word: randomWord.word,
      shape: randomWord.shape,
      imagePath: randomWord.imagePath,
      x: 100,
      y: 20 + Math.random() * 60,
      speed: config.speed
    };

    setEnemies(prev => [...prev, newEnemy]);
  };

  const gameLoop = (time) => {
    if (lastTimeRef.current !== undefined) {
      const deltaTime = time - lastTimeRef.current;

      spawnTimerRef.current += deltaTime;
      if (spawnTimerRef.current > config.spawnRate) {
        if (mode === 'practice' && enemies.length < 3) {
          spawnEnemy();
        } else if (mode === 'campaign' && enemies.length < 5) {
          spawnEnemy();
        }
        spawnTimerRef.current = 0;
      }

      setEnemies(prevEnemies =>
        prevEnemies
          .map(enemy => ({
            ...enemy,
            x: enemy.x - (enemy.speed * deltaTime) / 16
          }))
          .filter(enemy => {
            if (enemy.x < -10) {
              setHealth(h => Math.max(0, h - 10));
              return false;
            }
            return true;
          })
      );
    }

    lastTimeRef.current = time;
    animationRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    if (health <= 0 && mode === 'campaign') {
      cancelAnimationFrame(animationRef.current);
      onGameOver(score);
    }
  }, [health, mode, onGameOver, score]);

  useEffect(() => {
    if (mode === 'campaign' && enemiesDefeated >= config.enemiesRequired) {
      cancelAnimationFrame(animationRef.current);
      setShowLevelComplete(true);
    }
  }, [enemiesDefeated, mode, config.enemiesRequired]);

  const handleNextLevel = () => {
    if (level < 5) {
      setLevel(level + 1);
      setEnemiesDefeated(0);
      setHealth(100);
      setEnemies([]);
      setShowLevelComplete(false);
      spawnTimerRef.current = 0;
      lastTimeRef.current = undefined;
      animationRef.current = requestAnimationFrame(gameLoop);
    } else {
      onExit();
    }
  };

  useEffect(() => {
    spawnTimerRef.current = 0;
    lastTimeRef.current = undefined;
    animationRef.current = requestAnimationFrame(gameLoop);

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    return () => cancelAnimationFrame(animationRef.current);
  }, [level]);

  const handleEnemyDefeat = (enemy) => {
    cancelAnimationFrame(animationRef.current);
    setActiveEnemy(enemy);
  };

  const startDrawing = (e) => {
    if (!activeEnemy) return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    setCurrentPath([{ x, y }]);
  };

  const draw = (e) => {
    if (!isDrawing || !activeEnemy) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctx.strokeStyle = '#ff6b35';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (currentPath.length > 0) {
      const lastPoint = currentPath[currentPath.length - 1];
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    setCurrentPath(prev => [...prev, { x, y }]);
  };

  const stopDrawing = () => {
    if (!isDrawing || currentPath.length < 5) {
      setIsDrawing(false);
      return;
    }

    setIsDrawing(false);
    checkDrawing();
  };

  const checkDrawing = () => {
    if (!activeEnemy) return;

    const startX = currentPath[0].x;
    const endX = currentPath[currentPath.length - 1].x;
    const points = currentPath.length;
    const deltaX = endX - startX;

    let detectedShape = null;

    if (Math.abs(deltaX) > 100 && points > 10) {
      detectedShape = 'curve-right';
    } else if (points > 15) {
      detectedShape = 'loop';
    } else if (Math.abs(deltaX) < 50) {
      detectedShape = 'circle';
    } else if (points > 8) {
      detectedShape = 'wave';
    } else {
      detectedShape = 'hook';
    }

    if (detectedShape === activeEnemy.shape) {
      handleDrawingSuccess();
    } else {
      setTimeout(() => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        setCurrentPath([]);
      }, 500);
    }
  };

  const handleDrawingSuccess = () => {
    setScore(s => s + 100 * level);
    setEnemies(prev => prev.filter(e => e.id !== activeEnemy.id));
    setEnemiesDefeated(prev => prev + 1);
    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    setActiveEnemy(null);
    setCurrentPath([]);
    lastTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(gameLoop);
  };

  const handleClearDrawing = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setCurrentPath([]);
    setActiveEnemy(null);
    lastTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(gameLoop);
  };

  return (
    <div className="screen game-screen">
      <div className="game-container">
        <GameHUD 
          level={level} 
          score={score} 
          health={health} 
          mode={mode}
          enemiesDefeated={enemiesDefeated}
          enemiesRequired={config.enemiesRequired}
        />

        <div className="battlefield">
          {enemies.map(enemy => (
            <Enemy
              key={enemy.id}
              enemy={enemy}
              onDefeat={handleEnemyDefeat}
            />
          ))}
        </div>

        {mode === 'campaign' && (
          <div className="level-progress">
            <span className="progress-label">Enemies Defeated:</span>
            <span className="progress-count">{enemiesDefeated} / {config.enemiesRequired}</span>
          </div>
        )}

        <div className="drawing-box-container">
          {activeEnemy ? (
            <div className="active-target-display">
              <span className="target-label">TARGET:</span>
              <span className="target-word">{activeEnemy.word}</span>
              <span className="target-shape">({activeEnemy.shape})</span>
            </div>
          ) : (
            <div className="waiting-message">Click an enemy to draw!</div>
          )}
          
          <canvas
            ref={canvasRef}
            className={`battlefield-canvas ${activeEnemy ? 'active' : ''}`}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          
          {activeEnemy && (
            <button className="btn-clear-drawing" onClick={handleClearDrawing}>
              ✕ CANCEL
            </button>
          )}
        </div>

        <div className="game-footer">
          <button className="btn-retreat" onClick={onExit}>
            ← RETREAT
          </button>
        </div>

        {showLevelComplete && (
          <div className="level-complete-overlay">
            <div className="level-complete-content">
              <div className="victory-icon">👑</div>
              <h2 className="level-complete-title">LEVEL {level} COMPLETE!</h2>
              <p className="level-complete-score">Score: {score}</p>
              <p className="level-complete-stat">Enemies Defeated: {enemiesDefeated}</p>
              
              {level < 5 ? (
                <>
                  <p className="next-level-text">Ready for Level {level + 1}?</p>
                  <div className="level-complete-buttons">
                    <button className="btn-next-level" onClick={handleNextLevel}>
                      NEXT LEVEL →
                    </button>
                    <button className="btn-level-menu" onClick={onExit}>
                      MAIN MENU
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="game-won-text">🎉 YOU CONQUERED ALL LEVELS! 🎉</p>
                  <button className="btn-next-level" onClick={onExit}>
                    RETURN TO MENU
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainGame;