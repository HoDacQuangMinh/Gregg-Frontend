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

const Practice = ({ onBack }) => {
  const [selectedWord, setSelectedWord] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');
  
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
  }, [selectedWord]);

  const handleSelectWord = (word) => {
    setSelectedWord(word);
    setFeedback('');
    clearCanvas();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setCurrentPath([]);
  };

  const startDrawing = (e) => {
    if (!selectedWord) return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    setCurrentPath([{ x, y }]);
  };

  const draw = (e) => {
    if (!isDrawing || !selectedWord) return;
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
    if (!selectedWord) return;

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

    setAttempts(prev => prev + 1);

    if (detectedShape === selectedWord.shape) {
      setScore(prev => prev + 100);
      setFeedback('✓ CORRECT! Well done!');
      setTimeout(() => {
        clearCanvas();
        setFeedback('');
      }, 2000);
    } else {
      setFeedback(`✗ Try again! (Detected: ${detectedShape})`);
      setTimeout(() => {
        clearCanvas();
        setFeedback('');
      }, 1500);
    }
  };

  return (
    <div className="screen practice-screen">
      <div className="practice-container">
        <button className="btn-back" onClick={onBack}>← BACK TO MENU</button>
        
        <h2 className="practice-title">PRACTICE MODE</h2>
        
        <div className="practice-stats">
          <div className="stat-item">
            <span className="stat-label">Score:</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Attempts:</span>
            <span className="stat-value">{attempts}</span>
          </div>
        </div>

        <div className="practice-content">
          <div className="word-selection">
            <h3 className="section-title">Select a Word to Practice:</h3>
            <div className="word-grid">
              {GREGG_WORDS.map((word, index) => (
                <button
                  key={index}
                  className={`word-button ${selectedWord?.word === word.word ? 'active' : ''}`}
                  onClick={() => handleSelectWord(word)}
                >
                  <span className="word-text">{word.word}</span>
                  <span className="word-shape">{word.shape}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="practice-drawing-area">
            {selectedWord ? (
              <>
                <div className="current-target">
                  <span className="target-label">Practice Drawing:</span>
                  <span className="target-word">{selectedWord.word}</span>
                  <span className="target-shape">({selectedWord.shape})</span>
                </div>
                
                {feedback && (
                  <div className={`feedback-message ${feedback.includes('✓') ? 'success' : 'error'}`}>
                    {feedback}
                  </div>
                )}

                <canvas
                  ref={canvasRef}
                  className="practice-canvas active"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                
                <button className="btn-clear" onClick={clearCanvas}>
                  🗑️ CLEAR CANVAS
                </button>
              </>
            ) : (
              <div className="no-selection">
                <p>👆 Select a word above to start practicing</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Practice;