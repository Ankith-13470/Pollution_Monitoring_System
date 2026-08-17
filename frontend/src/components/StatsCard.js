import React from 'react';

const StatsCard = ({ title, value, icon, color, subtitle }) => {
  return (
    <div className="col-md-3 mb-4">
      <div className={`card stats-card border-0 bg-${color} text-white`}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="card-title mb-2">{title}</h6>
              <h2 className="mb-0">{value}</h2>
              {subtitle && <small className="opacity-75">{subtitle}</small>}
            </div>
            <div className="fs-1">
              {icon}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;