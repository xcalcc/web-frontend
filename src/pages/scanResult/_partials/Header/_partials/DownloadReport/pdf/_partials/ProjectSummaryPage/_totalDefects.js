import React from 'react';
import i18n from 'i18next';
import {Col, Row, Image, Container} from 'react-bootstrap';
import * as utils from 'Utils';
import SignUpIcon from 'Icons/indicator_up.svg';
import SignDownIcon from 'Icons/indicator_down.svg';
import SignDownFlat from 'Icons/indicator_flat.svg';

import './total-defects.scss';

const TotalDefectsBlock = props => {
    const {totalDefects, previousTotalDefects} = props;

    const diff = totalDefects - previousTotalDefects;

    let icon = SignDownFlat;
    if (diff > 0) {
        icon = SignUpIcon;
    } else if (diff < 0) {
        icon = SignDownIcon;
    }

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
                        <span className='icon'><Image src={icon}/></span>
                        <span>{utils.formatNumber(totalDefects)}</span>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default TotalDefectsBlock
