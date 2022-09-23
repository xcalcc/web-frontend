import React from 'react';
import {Doughnut} from "react-chartjs-2";

import './doughnut-number.scss';
const plugins = [
    {
        beforeDraw: function (chart) {
            const width = chart.chart.width,
                height = chart.chart.height,
                ctx = chart.chart.ctx;
            ctx.restore();
            const fontSize1 = (height / 110).toFixed(2);
            const fontSize2 = (height / 80).toFixed(2);

            ctx.font = fontSize1 + "em barlow_condensedregular";
            ctx.fillStyle = "#666666";
            ctx.textBaseline = "middle";
            const centerY = (chart.chartArea.top + chart.chartArea.bottom)/2;
            const text = chart.config.options.centerText.text,
                textX1 = Math.round((width - ctx.measureText(text[0]).width) / 2),
                textX2 = Math.round((width - ctx.measureText(text[1]).width - 5) / 2);
            
            ctx.fillText(text[0], textX1, centerY - height / 10);

            ctx.font = fontSize2 + "em barlow_condensedregular";
            ctx.fillText(text[1], textX2, centerY + height / 10);
            ctx.save();
        }
    }
];

const DoughnutNumber = props => {
    let mainCount = (props.data && props.data.previous) || 0;
    let secondaryCount = (props.data && props.data.current) || 0;

    if(mainCount === 0 && secondaryCount === 0) {
        secondaryCount = 100;
    }

    const data = {
        labels: [' ', ' '],
        legend: {display: props.legend || false},
        datasets: [
            {
                data: [mainCount, secondaryCount],
                backgroundColor: ['#d1d1d1', '#ececec'],
                hoverBackgroundColor: ['#d1d1d1', '#ececec'],
                borderWidth: 0,
            },
        ],
    };
    const options = {
        legend: {display: false},
        cutoutPercentage: 85,
        segmentShowStroke: false,
        maintainAspectRatio: true,
        aspectRatio: 100,
        position: 'center',
        animation:{
            animateScale:true
        },
        tooltips: {
            // callbacks: {
            //     label(tooltipItem, data) {
            //         const label = data.labels[tooltipItem.index]
            //         let datas = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            //         datas /= 10;
            //         return `${label} ${datas.toFixed(2)}`;
            //     }
            // },
            enabled: false,
        },
        centerText: {
            display: true,
            text: [props.label, props.percentage],
        },

    };

    return <div className="doughnut-number">
        <Doughnut
            data={data}
            options={options}
            plugins={plugins}
            width={props.width || 300}
        />
    </div>;
}

export default DoughnutNumber;