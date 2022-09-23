import React from 'react';
import { Radar } from 'react-chartjs-2';
import PropTypes from 'prop-types';

export default function SpiderChart({ chartData }) {
  return (
    <Radar
      data={chartData}
      options={{
        maintainAspectRadio: true,
        legend: {
          position: 'bottom',
        },
        scale: {
          pointLabels: {
            fontSize: '15',
          },
          reverse: false,
          ticks: {
            beginAtZero: true,
            suggestedMin: 50,
            suggestedMax: 100,
          },
        },
        elements: {
          line: {
            borderWidth: '1.5',
          },
          point: {
            pointStyle: 'dash',
          },
        },
        scaleSteps: 5,
        scaleStepWidth: 20,
        scaleStartValue: 100,
      }}
    />
  );
}

SpiderChart.propTypes = {
  chartData: PropTypes.objectOf(PropTypes.object).isRequired,
};
