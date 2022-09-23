import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import classNames from "classnames";
import i18n from "i18next";
import Meter from 'Components/Meter';
import enums from "Common/enumeration";

import './style.scss';

export default props => {
    let riskValue, riskName;

    switch(props.risk){
        case enums.ISSUE_PRIORITY.low:
            riskValue = 30;
            riskName = i18n.t('pages.scan-result.LOW');
            break;
        case enums.ISSUE_PRIORITY.medium:
            riskValue = 90;
            riskName = i18n.t('pages.scan-result.MEDIUM');
            break;
        case enums.ISSUE_PRIORITY.high:
            riskValue = 150;
            riskName = i18n.t('pages.scan-result.HIGH');
            break;
        default:
            riskValue = 0;
            break;
    }

    return (
        <Container className="meter-block noPadding" fluid>
            <Row noGutters>
                <Col className="left-area">
                    <p className="title">{i18n.t('pages.scan-result.project-risk')}</p>
                    <div
                        className={classNames('pill', {
                            low: props.risk === enums.ISSUE_PRIORITY.low,
                            medium: props.risk === enums.ISSUE_PRIORITY.medium,
                            high: props.risk === enums.ISSUE_PRIORITY.high
                        })}
                    >
                        {riskName}
                    </div>
                </Col>
                <Col className="right-area">
                    <Meter
                        key={riskValue}
                        value={riskValue}
                    />
                </Col>
            </Row>
        </Container>
    )
}