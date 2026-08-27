import React from 'react';

const DashboardCard = ({ title, value, icon: Icon, color = 'primary', subtext }) => {
  return (
    <div className="glass-card p-4 h-100 position-relative overflow-hidden">
      <div className="d-flex align-items-center justify-content-between">
        <div>
          <span className="text-uppercase text-muted fw-bold small" style={{ letterSpacing: '0.5px' }}>
            {title}
          </span>
          <h2 className="display-6 fw-bold mb-0 mt-1">{value}</h2>
          {subtext && <p className="text-muted small mb-0 mt-2">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-4 bg-${color}-subtle text-${color} d-flex align-items-center justify-content-center`}>
          {Icon && <Icon size={28} />}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
