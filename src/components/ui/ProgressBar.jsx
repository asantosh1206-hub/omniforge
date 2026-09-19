import React from 'react';
import './ui.css';

const ProgressBar = ({ progress = 0, status = 'processing', showLabel = true, height = 8 }) => {
  const statusMap = {
    completed: 'success',
    processing: 'info',
    queued: 'warning',
    failed: 'danger'
  };

  const statusType = statusMap[status?.toLowerCase()] || 'info';
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="progress-container">
      <div 
        className="progress-track" 
        style={{ height: `${height}px` }}
      >
        <div 
          className={`progress-fill progress-fill--${statusType} ${status === 'processing' ? 'progress-fill--shimmer' : ''}`}
          style={{ width: `${clampedProgress}%` }}
        ></div>
      </div>
      {showLabel && (
        <span className="progress-label">{Math.round(clampedProgress)}%</span>
      )}
    </div>
  );
};

export default ProgressBar;
