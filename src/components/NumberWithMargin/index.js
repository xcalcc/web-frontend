import React from 'react';
import {Row, Col} from 'react-bootstrap';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './number-with-margin.sass';

const NumberWithMargin = props => {
    const marginOnly = props.marginOnly;
    const marginText = props.margin > 0 ? `+${props.margin}` : props.margin;

    let titleBlock = props.title && <Row noGutters>
        <Col md={12}>
            <div className='title'>{props.title}</div>
        </Col>
    </Row>;

    let numberWithMarginBlockOneLine = <Col md={12} className='number-container-one-line'>
        <div className='number'>{props.number}</div>
        <div className='margin-text'>{marginText}</div>
    </Col>;
    let numberWithMarginBlockTwoLines = <Col md={12} className='number-container-two-lines'>
        <div className='number'>{props.number}</div>
        <div className='margin-text'>{marginText}</div>
    </Col>;

    return <div className={classNames('number-with-margin', {
        grey: marginOnly
    })}>
        {titleBlock}
        <Row noGutters>
            {
                marginOnly ? <Col md={12} className='margin-text'>{marginText}</Col> :
                (props.twoLines ? numberWithMarginBlockTwoLines : numberWithMarginBlockOneLine)
            }
        </Row>
    </div>;
}

NumberWithMargin.propTypes = {
    marginOnly: PropTypes.bool,
    margin: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    title: PropTypes.string,
    number: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}
NumberWithMargin.defaultProps = {
    marginOnly: false,
    margin: null,
    title: '',
    number: 0,
}

export default NumberWithMargin;