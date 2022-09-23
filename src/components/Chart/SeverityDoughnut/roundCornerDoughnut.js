import React from 'react';
import {Chart, Doughnut} from 'react-chartjs-2';

// round corners
Chart.pluginService.register({
    afterUpdate: function (chart) {
        if (chart.config.options.elements.arc.roundedCornersFor !== undefined) {
            var arc = chart.getDatasetMeta(0).data[chart.config.options.elements.arc.roundedCornersFor];
            arc.round = {
                x: (chart.chartArea.left + chart.chartArea.right) / 2,
                y: (chart.chartArea.top + chart.chartArea.bottom) / 2,
                radius: (chart.outerRadius + chart.innerRadius) / 2,
                thickness: (chart.outerRadius - chart.innerRadius) / 2 - 1,
                backgroundColor: arc._model.backgroundColor
            }

            var dataset = (chart.data && chart.data.datasets && chart.data.datasets[0]) || {};
            var roundValue = (dataset.data || [])[0];
            var backgroundColor = (dataset.backgroundColor || [])[1];
            if(roundValue === 0) {
                arc.round.backgroundColor = backgroundColor;
            }
        }
    },

    afterDraw: function (chart) {
        if (chart.config.options.elements.arc.roundedCornersFor !== undefined) {
            var ctx = chart.chart.ctx;
            var arc = chart.getDatasetMeta(0).data[chart.config.options.elements.arc.roundedCornersFor];
            var startAngle = Math.PI / 2 - arc._view.startAngle;
            var endAngle = Math.PI / 2 - arc._view.endAngle;

            ctx.save();
            ctx.translate(arc.round.x, arc.round.y);

            ctx.fillStyle = arc.round.backgroundColor;
            ctx.beginPath();
            ctx.arc(arc.round.radius * Math.sin(startAngle), arc.round.radius * Math.cos(startAngle), arc.round.thickness, 0, 2 * Math.PI);
            ctx.arc(arc.round.radius * Math.sin(endAngle), arc.round.radius * Math.cos(endAngle), arc.round.thickness, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    },
});

// write text plugin
Chart.pluginService.register({
    afterUpdate: function (chart) {
        if (chart.config.options.elements.center) {
            var helpers = Chart.helpers;
            var centerConfig = chart.config.options.elements.center;
            var globalConfig = Chart.defaults.global;
            var ctx = chart.chart.ctx;

            var fontStyle = helpers.getValueOrDefault(centerConfig.fontStyle, globalConfig.defaultFontStyle);
            var fontFamily = helpers.getValueOrDefault(centerConfig.fontFamily, globalConfig.defaultFontFamily);
            let fontSize = centerConfig.fontSize;
            if (!centerConfig.fontSize) {
                ctx.save();
                fontSize = helpers.getValueOrDefault(centerConfig.minFontSize, 1);
                var maxFontSize = helpers.getValueOrDefault(centerConfig.maxFontSize, 256);
                var maxText = helpers.getValueOrDefault(centerConfig.maxText, centerConfig.text);

                do {
                    ctx.font = helpers.fontString(fontSize, fontStyle, fontFamily);
                    var textWidth = ctx.measureText(maxText).width;

                    // check if it fits, is within configured limits and that we are not simply toggling back and forth
                    if (textWidth < chart.innerRadius * 2 && fontSize < maxFontSize)
                        fontSize += 1;
                    else {
                        // reverse last step
                        fontSize -= 1;
                        break;
                    }
                } while (true)
                ctx.restore();
            }

            // save properties
            chart.center = {
                font: helpers.fontString(fontSize, fontStyle, fontFamily),
                fillStyle: helpers.getValueOrDefault(centerConfig.fontColor, globalConfig.defaultFontColor)
            };
        }
    },
    afterDraw: function (chart) {
        if (chart.center) {
            var centerConfig = chart.config.options.elements.center;
            var ctx = chart.chart.ctx;

            ctx.save();
            ctx.font = chart.center.font;
            ctx.fillStyle = centerConfig.fillStyle || chart.center.fillStyle;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            var centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
            var centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;

            if(typeof centerConfig.text === 'string' || centerConfig.text.length === 1) {
                ctx.font = `${centerConfig.fontWeight} ${centerConfig.fontSize[0]} ${centerConfig.fontFamily}`;
                ctx.fillText(centerConfig.text[0], centerX, centerY);
            } else {
                ctx.font = `${centerConfig.fontWeight} ${centerConfig.fontSize[0]} ${centerConfig.fontFamily}`;
                ctx.fillText(centerConfig.text[0], centerX, centerY - 8);
    
                ctx.font = `${centerConfig.fontWeight} ${centerConfig.fontSize[1]} ${centerConfig.fontFamily}`;
                ctx.fillText(centerConfig.text[1], centerX, centerY + 9);
            }

            ctx.restore();
        }
    },
});

const options = {
    elements: {
        arc: {
            roundedCornersFor: 0
        },
        center: {
            // the longest text that could appear in the center
            maxText: '100%',
            text: '67%',
            fontColor: '#FFFFF',
            // fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            fontStyle: 'normal',
            // fontSize: 12,
            // if a fontSize is NOT specified, we will scale (within the below limits) maxText to take up the maximum space in the center
            // if these are not specified either, we default to 1 and 256
            minFontSize: 1,
            maxFontSize: 256,
        }
    },
    tooltips: {
        enabled: false
    },
};

const RoundCornerDoughnut = props => {
    return <Doughnut data={props.data} options={options} {...props} />
}

export default RoundCornerDoughnut;