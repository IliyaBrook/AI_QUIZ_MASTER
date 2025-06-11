import React from 'react';
import './LoadingSpinner.scss';

interface LoadingSpinnerProps {
  progress?: number;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  progress = 0, 
  message = 'Loading...' 
}) => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>{message}</p>
    {progress > 0 && (
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="progress-text">{progress}%</span>
      </div>
    )}
  </div>
);

export default LoadingSpinner; 