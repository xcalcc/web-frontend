import React from 'react';
import {Col} from 'react-bootstrap';
import Item from './Item';

const VerticallyList = ({ruleCountMapList, highRiskCount, chartPercentage, issueTotalCount}) => {

    return <>
        <Col className="rule-list scrollbar">
            {
                ruleCountMapList.map((ruleData, idx) => <Item key={idx} ruleData={ruleData}></Item>)
            }
        </Col>
    </>;
}

export default VerticallyList;