import React from 'react';

const ProgressBar = ({ label, value, max = 100, variant = 'primary' }) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <span className="fw-medium small">{label}</span>
        <span className="fw-bold small text-muted">{percentage}% ({value}/{max})</span>
      </div>
      <div className="progress rounded-pill" style={{ height: '10px', background: 'rgba(255,255,255,0.08)' }}>
        <div 
          className={`progress-bar bg-${variant} rounded-pill progress-bar-striped progress-bar-animated`} 
          role="progressbar" 
          style={{ width: `${percentage}%` }}
          aria-valuenow={percentage} 
          aria-valuemin="0" 
          aria-valuemax="100"
        />
      </div>
    </div>
  );
};

export default ProgressBar;
