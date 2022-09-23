import React from 'react';
import i18n from 'i18next';
import {Container, Row, Col} from "react-bootstrap";
import * as utils from 'Utils';
import TrendIcon from "Components/TrendIcon";

import './style.scss';

const TotalDefectsBlock = props => {
    const {
        isDsrPage,
        totalDefects,
        previousTotalDefects
    } = props;

    return <Container fluid className='total-defects-block text-center noPadding'>
        <Row>
            <Col>
                <p className="title">{i18n.t('pages.scan-result.issue-total')}</p>
            </Col>
        </Row>
        <Row>
            <Col>
                {
                    isDsrPage &&
                    <span className="icon">
                        <TrendIcon
                            value={totalDefects}
                            baselineValue={previousTotalDefects}
                        />
                    </span>
                }
                <span className="digits">{utils.formatNumber(totalDefects)}</span>
            </Col>
        </Row>
    </Container>
}

export default TotalDefectsBlock;
