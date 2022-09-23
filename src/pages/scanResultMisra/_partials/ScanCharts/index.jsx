import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import MetasBlock from '../../../scanResult/_partials/ScanCharts/_partials/MetasBlock';
import TotalDefectsBlock from './_partials/TotalDefectsBlock';
import SeverityBlock from './_partials/SeverityBlock';

import './style.scss';

const ScanCharts = props => {
    const {
        isDsrPage,
        scanMode,
        currentProjectSummary,
        previousProjectSummary
    } = props;

    if(!currentProjectSummary) return null;

    return <Container fluid className="scan-result-charts noPadding">
        <Row>
            <Col xs={4} className="metas-wrap">
                <MetasBlock scanMode={scanMode} currentProjectSummary={currentProjectSummary} />
            </Col>
            <Col xs={2}>
                <TotalDefectsBlock 
                    isDsrPage={isDsrPage}
                    totalDefects={currentProjectSummary.issuesCount} 
                    previousTotalDefects={previousProjectSummary && previousProjectSummary.issuesCount} 
                />
            </Col>
            <Col>
                <SeverityBlock 
                    riskDataMap={{
                        HIGH: 0,
                        MEDIUM: 0,
                        LOW: 0,
                        ...currentProjectSummary.criticalityCountMap
                    }}
                    totalIssues={Number(currentProjectSummary.issuesCount)}
                />
            </Col>
        </Row>
    </Container>

}

export default ScanCharts;