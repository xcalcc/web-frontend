import React from 'react';
import PropTypes from 'prop-types';
import {InfoCircleFill} from 'react-bootstrap-icons';
import {OverlayTrigger, Popover} from 'react-bootstrap';

import './style.scss';

const TooltipWrapper = props => {
    if(!props.tooltipText) {
        return props.children;
    }

    //ignore findDOMNode warning
    //https://github.com/react-bootstrap/react-bootstrap/issues/3518
    const renderTooltip = props =>
        <Popover content
            className={props.className}
        >
            <div dangerouslySetInnerHTML={{__html: props.tooltipText}} />
        </Popover>;

    return <OverlayTrigger
            placement={props.options.placement}
            delay={props.options.delay}
            overlay={renderTooltip(props)}
        >
            {props.children}
        </OverlayTrigger>;
}
TooltipWrapper.propTypes = {
    options: PropTypes.object,
    children: PropTypes.element,
    tooltipText: PropTypes.string,
    className: PropTypes.string
}
TooltipWrapper.defaultProps = {
    options: {
        placement: 'top',
        delay: {show: 100, hide: 400},
    },
    children: <div className="default-info-tooltip">
        <InfoCircleFill />
    </div>,
    tooltipText: ''
}

export default TooltipWrapper;