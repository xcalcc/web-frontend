import React from 'react';
import './CircleChart.scss';

const CircleChart = (props) => {
  return (
    <div className="barChartCompoent">
      <div className="header-card">
        <text className="text-bold font-fm header-text">TOTAL DEFECT SCORE</text>
        <div className="card-header-actions">
          <a href="http://www.chartjs.org" className="card-header-action" />
        </div>
      </div>
      <div className="flex-wrapper">
        <div className="single-chart">
          <svg viewBox="0 0 36 36" className="circular-chart blue">
            <path
              className="circle-bg"
              d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="circle"
              strokeDasharray="65, 20, 15"
              d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="circle"
              strokeDasharray="60, 20, 15"
              d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <text x="13.5" y="12" className="bold font-sm">
              DELTA
            </text>
            <text x="18" y="24" className="percentage font-fm">
              0.3
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CircleChart;
