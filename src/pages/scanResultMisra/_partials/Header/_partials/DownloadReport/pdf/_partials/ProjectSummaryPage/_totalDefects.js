import React from 'react';
import i18n from 'i18next';
import {Col, Row, Container} from 'react-bootstrap';
import * as utils from 'Utils';

import './total-defects.scss';

const TotalDefectsBlock = props => {
    const {totalDefects} = props;

    return (
        <Container
            style={{paddingLeft: 0, paddingRight: 0}}
            className='total-defects-block-pdf block'>
            <Row noGutters>
                <Col md={12}>
                    <h6 className='total-defects-block-pdf__title'>
                        {i18n.t('pages.scan-result.issue-total')}
                    </h6>
                </Col>
            </Row>
            <Row noGutters>
                <Col md={12} className='digits'>
                    <div className='digits__inner'>
                        <span>{utils.formatNumber(totalDefects)}</span>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default TotalDefectsBlock
