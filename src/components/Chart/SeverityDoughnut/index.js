import React from 'react';
import {Row, Col} from "react-bootstrap";
import PropTypes from 'prop-types';
import classNames from "classnames";
import * as utils from "Utils";
import Doughnut from './roundCornerDoughnut';

import './style.scss';

const SeverityDoughnut = props => {
    const {
        issues,
        totalIssues,
        percentageText,
        levelText,
        isHorizontalAlign,
        theme,
    } = props;

    let mainCount = issues;
    let restCount = totalIssues - issues;
    if(mainCount === 0 && restCount === 0) {
        restCount = 100;
    }

    let doughnutRingColorColor_main='#FF6384';
    let doughnutRingColorColor_rest='#36A2EB';

    switch (theme) {
        case 'high':
            doughnutRingColorColor_rest='#f4cccf';
            doughnutRingColorColor_main='#f7323f';
            break;
        case 'medium':
            doughnutRingColorColor_rest='#f4ddcc';
            doughnutRingColorColor_main='#f78732';
            break;
        case 'low':
            doughnutRingColorColor_rest='#cce3f4';
            doughnutRingColorColor_main='#32a2f7';
            break;
        default:
            break;
    }

    const doughnutChart = 
        <Doughnut
            width={230}
            data={{
                datasets: [{
                    data: [mainCount, restCount],
                    backgroundColor: [
                        doughnutRingColorColor_main,
                        doughnutRingColorColor_rest,
                    ],
                    hoverBackgroundColor: [
                        doughnutRingColorColor_main,
                        doughnutRingColorColor_rest,
                    ],
                    borderWidth: 0,
                }]
            }}
            legend={{
                display: false,
            }}
            options={
                {
                    cutoutPercentage: 82,
                    elements: {
                        arc: {
                            roundedCornersFor: 0
                        },
                        center: {
                            // the longest text that could appear in the center
                            maxText: '90%',
                            text: isHorizontalAlign ? [percentageText] : [percentageText, levelText],
                            fontStyle: 'normal',
                            fontWeight: 600,
                            fontSize: ['18px', '13px'],
                            minFontSize: 1,
                            maxFontSize: 256,
                            fillStyle: '#000000',
                            fontFamily: 'barlow_condensedregular'
                        }
                    },
                    tooltips: {
                        enabled: false
                    }
                }
            }
        />;

    const VerticalAlign = <>
        <Row noGutters>
            <Col>
                <div className="chart">
                    {doughnutChart}
                </div>
            </Col>
        </Row>
        <Row noGutters>
            <Col>
                <div className="severity-level">
                    <p className="number">{utils.formatNumber(issues)}</p>
                </div>
            </Col>
        </Row>
    </>;

    const HorizontalAlign = <>
        <Row noGutters>
            <Col>
                <div className="chart">
                    {doughnutChart}
                </div>
                <div className="severity-level">
                    <p className="name">{levelText}</p>
                    <p className="number">{utils.formatNumber(issues)}</p>
                </div>
            </Col>
        </Row>
    </>;

    return <div className={classNames("severity-doughnut2", {
        'theme-high': theme === 'high',
        'theme-medium': theme === 'medium',
        'theme-low': theme === 'low',
        'align-horizontal': isHorizontalAlign,
    })}>
        {isHorizontalAlign ? HorizontalAlign : VerticalAlign}
    </div>;
}

SeverityDoughnut.propTypes = {
    issues: PropTypes.number,
    totalIssues: PropTypes.number,
    levelText: PropTypes.string,
    percentageText: PropTypes.string,
    isHorizontalAlign: PropTypes.bool,
    theme: PropTypes.oneOf(['high', 'medium', 'low']),
}
SeverityDoughnut.defaultProps = {
    issues: 0,
    totalIssues: 0,
    levelText: PropTypes.string,
    percentageText: undefined,
    isHorizontalAlign: false,
    theme: 'low'
}

export default SeverityDoughnut;
