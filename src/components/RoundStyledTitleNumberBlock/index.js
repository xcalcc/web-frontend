import React from 'react';
import classNames from "classnames";
import PropTypes from 'prop-types';
import TooltipWrapper from "Components/TooltipWrapper";

import './round-styled-title-number-block.scss';


const RoundStyledTitleNumberBlock = props => {

    const number = props.withSign && props.number > 0 ? `+${props.number}` : props.number;

    return <div className={classNames('round-styled-title-number-block', {
        red: props.red,
        orange: props.orange,
        blue: props.blue,
        grey: props.grey,
        'auto-width': props.autoWidth
    })}>
        <div className="round-styled-title-number-block-title-number">
            <div 
                className={classNames('title', 'round', {
                    active: props.active
                })}
                onClick={props.onClick}
            >
                {props.title}
            </div>
            <div className="number round">{number}</div>
        </div>

        <div className="round-styled-title-number-block-tooltip">
        {
            props.tooltip &&
                <TooltipWrapper
                    tooltipText={props.tooltip}
                />
        }
        </div>
    </div>;
}
RoundStyledTitleNumberBlock.propTypes = {
    number: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    withSign: PropTypes.bool,
}
RoundStyledTitleNumberBlock.defaultProps = {
    number: 0,
    withSign: false,
}

export default RoundStyledTitleNumberBlock;
