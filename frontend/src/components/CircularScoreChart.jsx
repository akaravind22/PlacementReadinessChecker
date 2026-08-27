import React from 'react';

const CircularScoreChart = ({ score = 0, category = 'Needs Improvement' }) => {
  const getScoreDetails = (val) => {
    if (val >= 85) return { color: '#10b981', glow: 'rgba(16, 185, 129, 0.4)', textClass: 'text-success', badge: 'bg-success-subtle text-success border-success' };
    if (val >= 70) return { color: '#3b82f6', glow: 'rgba(59, 130, 246, 0.4)', textClass: 'text-primary', badge: 'bg-primary-subtle text-primary border-primary' };
    if (val >= 50) return { color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)', textClass: 'text-warning', badge: 'bg-warning-subtle text-warning border-warning' };
    return { color: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)', textClass: 'text-danger', badge: 'bg-danger-subtle text-danger border-danger' };
  };

  const details = getScoreDetails(score);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-3 text-center">
      <div className="circular-chart-container mb-3">
        <div 
          className="circular-chart-ring"
          style={{ 
            '--score-pct': score,
            '--accent-color': details.color,
            '--glow-color': details.glow
          }}
        >
          <div className="circular-chart-inner">
            <div className={`score-number ${details.textClass}`}>{score}</div>
            <div className="score-label">Out of 100</div>
          </div>
        </div>
      </div>

      <div className={`badge px-3 py-2 border rounded-pill fw-semibold ${details.badge}`}>
        {category}
      </div>
    </div>
  );
};

export default CircularScoreChart;
