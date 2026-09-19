import React from 'react';
import './ui.css';

const Card = ({ children, className = '', hover = false, padding = 'md', onClick }) => {
  const classNames = [
    'card',
    `card--padding-${padding}`,
    hover ? 'card--hover' : '',
    onClick ? 'card--clickable' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={classNames} 
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};

export default Card;
