import React from "react";
import { Radar } from "react-chartjs-2";
import './BarChart.scss'

const BarChart = (props) => {
  return (
    <div className="barChartCompoent">
       <div className="header-card">
              <text className="text-bold font-fm header-text">TOTAL DEFECT SCORE</text>
              <div className="card-header-actions">
                <a href="http://www.chartjs.org" className="card-header-action">
                </a>
              </div>
              </div>
        <div  className="radar-chart">
          <Radar
            data={props.chartData}
            options={{
              maintainAspectRadio: true,
              legend: {
                position: "bottom"
              },
              scale: {
                pointLabels: {
                  fontSize: "15"
                },
                reverse: false,
                ticks: {
                  beginAtZero: true,
                  suggestedMin: 50,
                  suggestedMax: 100
                }
              },
              elements: {
                line: {
                  borderWidth: "1.5"
                },
                point: {
                  pointStyle: "dash"
                }
              },
              scaleSteps: 5,
              scaleStepWidth: 20,
              scaleStartValue: 100
            }}
          />
      </div>
    </div>
  );
};

export default BarChart;
