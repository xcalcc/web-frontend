import React from 'react';
import {Container, Row, Col} from "react-bootstrap";
import i18n from 'i18next';
import DataList from '../../../../../../scanResult/_partials/IssueFilter/_partials/FilterPopup/_partials/DataList';

const RuleBlock = props => {
    const {
        currentFilter,
        onSelectRule,
        groupBySeverity,
    } = props;

    const severityMapping = {
        H: 'HIGH',
        M: 'MEDIUM',
        L: 'LOW'
    }
    const onSelect = ruleObj => {
        onSelectRule && onSelectRule(ruleObj);
    }

    return <Container>
        <Row>
            <Col xs={1} className="types">
                {i18n.t(`pages.scan-result.issue-type`)}
            </Col>
            {
                Object.keys(groupBySeverity).map((severity, idx) => {
                    return <Col key={idx}>
                        <DataList
                            noScrollY={false}
                            groupId={severity}
                            title={i18n.t(`misra.severity.${severityMapping[severity]}`)}
                            items={groupBySeverity[severity]}
                            onSelect={onSelect}
                            selected={currentFilter.ruleCodes.map(ruleObj =>
                                `${ruleObj.ruleCode}-${ruleObj.criticality}`)}
                        />
                    </Col>
                })
            }
        </Row>
    </Container>;
}

export default RuleBlock;