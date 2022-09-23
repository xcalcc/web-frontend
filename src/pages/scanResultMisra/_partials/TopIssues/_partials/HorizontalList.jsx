import React from 'react';
import {Col} from 'react-bootstrap';
import i18n from 'i18next';
import DoughnutChart from 'Components/DoughnutNumber';
import Item from './Item';

const HorizontalList = ({ruleCountMapList, highRiskCount, chartPercentage, issueTotalCount}) => {

    let group1 = [];
    let group2 = [];

    if(Array.isArray(ruleCountMapList)) {
        group1 = ruleCountMapList.slice(0, 5);
        group2 = ruleCountMapList.slice(5, 10);
    }

    return <>
        {
            <Col xs={2} className="top-issues-chart">
                <DoughnutChart
                    label={i18n.t('misra.severity.HIGH')}
                    percentage={chartPercentage}
                    data={
                        {
                            previous: highRiskCount,
                            current: issueTotalCount - highRiskCount
                        }
                    }
                    width={140}
                    height={140}
                />
            </Col>
        }
        <Col xs={5} className="rule-list">
            {
                group1.map((ruleData, idx) => <Item key={idx} ruleData={ruleData}></Item>)
            }
        </Col>
        <Col xs={5} className="rule-list">
            {
                group2.map((ruleData, idx) => <Item key={idx} ruleData={ruleData}></Item>)
            }
        </Col>
    </>;
}

export default HorizontalList;