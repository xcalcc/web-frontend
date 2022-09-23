import React from 'react';
import {Container, Col, Row} from "react-bootstrap";
import i18n from 'i18next';
import enums from 'Enums';
import SeverityDoughnut from 'Components/Chart/SeverityDoughnut';
import './style.scss';

const SeverityBlock = props => {
    const {
        totalIssues,
        riskDataMap
    } = props;

    const highIssues = Number(riskDataMap[enums.ISSUE_CRITICALITY.high]) || 0;
    const mediumIssues = Number(riskDataMap[enums.ISSUE_CRITICALITY.medium]) || 0;
    const lowIssues = Number(riskDataMap[enums.ISSUE_CRITICALITY.low]) || 0;

    let highPercentage = 0, 
        mediumPercentage = 0, 
        lowPercentage = 0;

    if(totalIssues > 0) {
        highPercentage = highIssues / totalIssues * 100;
        mediumPercentage = mediumIssues / totalIssues * 100;

        highPercentage = highPercentage > 0 && highPercentage < 1 ? 1 : Math.round(highPercentage);
        mediumPercentage = mediumPercentage > 0 && mediumPercentage < 1 ? 1 : Math.round(mediumPercentage);
        lowPercentage = (100 - highPercentage - mediumPercentage) || 1;

        if(highPercentage === 100 || mediumPercentage === 100 || lowIssues === 0) {
            lowPercentage = 0;
        }
    }

    return <Container fluid className="risk-severity-block-misra noPadding">
        <Row noGutters>
            <Col xs={4} className="align-content-end">
                <SeverityDoughnut
                    theme='high'
                    issues={highIssues}
                    totalIssues={totalIssues}
                    levelText={i18n.t('misra.severity.HIGH')}
                    percentageText={highPercentage + '%'}
                    isHorizontalAlign={true}
                />
            </Col>
            <Col xs={4} className="align-content-end">
                <SeverityDoughnut
                    theme='medium'
                    issues={mediumIssues}
                    totalIssues={totalIssues}
                    levelText={i18n.t('misra.severity.MEDIUM')}
                    percentageText={mediumPercentage + '%'}
                    isHorizontalAlign={true}
                />
            </Col>
            <Col xs={4} className="align-content-end">
                <SeverityDoughnut
                    theme='low'
                    issues={lowIssues}
                    totalIssues={totalIssues}
                    levelText={i18n.t('misra.severity.LOW')}
                    percentageText={lowPercentage + '%'}
                    isHorizontalAlign={true}
                />
            </Col>
        </Row>
    </Container>
}

export default SeverityBlock;
