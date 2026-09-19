import React from 'react';
import './ui.css';

const StatusBadge = ({ status, size = 'md' }) => {
  const statusMap = {
    completed: 'success',
    processing: 'info',
    queued: 'warning',
    failed: 'danger'
  };

  const statusType = statusMap[status?.toLowerCase()] || 'info';

  return (
    <div className={`status-badge status-badge--${size} status-badge--${statusType}`}>
      <span className="status-badge__dot"></span>
      <span className="status-badge__text">
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
      </span>
    </div>
  );
};

export default StatusBadge;
