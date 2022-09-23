import React from 'react';
import PropTypes from 'prop-types';
import {ArrowUpShort, ArrowDownShort} from 'react-bootstrap-icons';
import * as utils from "Utils";
import './number-with-arrow.scss';

const NumberWithArrow = props => {
    const arrows = {
        up: <ArrowUpShort/>,
        down: <ArrowDownShort/>,
    }
    let arrowType;
    switch (props.arrow) {
        case 1:
            arrowType = 'up';
            break;
        case -1:
            arrowType = 'down';
            break;
        default:
            arrowType = null;
            break;
    }
    return <div className="number-with-arrow">
        {
            arrowType && props.sup ? <sup>{arrows[arrowType]}</sup> :
                arrows[arrowType]
        }
        {utils.formatNumber(props.number)}
    </div>;
};

NumberWithArrow.propTypes = {
    number: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    arrow: PropTypes.oneOf([1, -1, 0]),
}
NumberWithArrow.defaultProps = {
    number: 0,
}

export default NumberWithArrow;
