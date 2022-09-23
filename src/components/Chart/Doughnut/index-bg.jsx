import React from 'react';
import { Doughnut, Chart } from 'react-chartjs-2';
import PropTypes from 'prop-types';

Chart.defaults.RoundedDoughnut = Chart.helpers.clone(Chart.defaults.doughnut);
        Chart.controllers.RoundedDoughnut = Chart.controllers.doughnut.extend({
            draw (ease) {
            		const {ctx} = this.chart.chart;
                
                const easingDecimal = ease || 1;
                Chart.helpers.each(this.getDataset().metaData, function (arc, index) {
                    arc.transition(easingDecimal).draw();

                    const vm = arc._view;
                    const radius = (vm.outerRadius + vm.innerRadius) / 2;
                    const thickness = (vm.outerRadius - vm.innerRadius) / 2;
                    const angle = Math.PI - vm.endAngle - Math.PI / 2;
                    
                    ctx.save();
                    ctx.fillStyle = vm.backgroundColor;
                    ctx.translate(vm.x, vm.y);
                    ctx.beginPath();
                    ctx.arc(radius * Math.sin(angle), radius * Math.cos(angle), thickness, 0, 2 * Math.PI);
                    ctx.arc(radius * Math.sin(Math.PI), radius * Math.cos(Math.PI), thickness, 0, 2 * Math.PI);
                    ctx.closePath();
                    ctx.fill();
                    ctx.restore();
                });
            },
        });
        
const opt = {
  cutoutPercentage: 90,
};

function ChartDoughnutBg({ data }) {
  return <Doughnut data={data} options={opt} />;
}

ChartDoughnutBg.propTypes = {
  data: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default ChartDoughnutBg;
