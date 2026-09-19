import React from 'react';
import './ui.css';

const ToggleSwitch = ({ checked, onChange, label }) => {
  return (
    <div className="toggle-container" onClick={() => onChange(!checked)}>
      <div className={`toggle-switch ${checked ? 'toggle-switch--checked' : ''}`}>
        <div className="toggle-thumb"></div>
      </div>
      {label && <span className="toggle-label">{label}</span>}
    </div>
  );
};

export default ToggleSwitch;
