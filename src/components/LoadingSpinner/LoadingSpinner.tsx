import React, { useState, useEffect } from 'react';
import './LoadingSpinner.scss';

interface LoadingSpinnerProps {
  message?: string;
  showTimer?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Generating response...', 
  showTimer = true 
}) => {
  // Ollama-style spinner frames
  const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  const [frame, setFrame] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    // Animate spinner every 100ms (same as Ollama)
    const spinnerInterval = setInterval(() => {
      setFrame(prev => (prev + 1) % spinnerFrames.length);
    }, 100);

    return () => clearInterval(spinnerInterval);
  }, [spinnerFrames.length]);

  useEffect(() => {
    if (!showTimer) return;

    // Timer for elapsed time
    const startTime = Date.now();
    const timerInterval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [showTimer]);

  const formatElapsedTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m${remainingSeconds}s`;
  };

  return (
    <div className="loading-spinner">
      <div className="spinner-container">
        <span className="ollama-spinner">{spinnerFrames[frame]}</span>
        <div className="spinner-message">
          <p className="message">{message}</p>
          {showTimer && elapsedTime > 0 && (
            <span className="elapsed-time">{formatElapsedTime(elapsedTime)}</span>
          )}
        </div>
      </div>
    </div>
  );
};