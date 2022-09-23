import React from "react";
import i18n from "i18next";
import classNames from "classnames";
import {Row, Col} from 'react-bootstrap';
import TooltipWrapper from "Components/TooltipWrapper";
import NumberWithMargin from "Components/NumberWithMargin";

import './severity-block.scss';

const SeverityBlock = props => {
    const blocks = Object.keys(props.data).length && Object.keys(props.data).map((key, idx) => {
        return <Col key={idx} md={Math.round(12/Object.keys(props.data).length)}>
            <NumberWithMargin
                marginOnly={props.marginOnly}
                title={i18n.t(`common.severity.${key}`, props.lang).toUpperCase()}
                number={props.data[key]['count']}
                margin={props.data[key]['margin']}
            />
        </Col>
    });
    const contentColumnWidth = !!props.title ? 8 : 10;
    return <div className={classNames("severity-block", {
        'left-divider': props.leftDivider,
        'right-divider': props.rightDivider,
    })}>
        <Row noGutters>
            {
                props.title &&
                <Col md={11-contentColumnWidth} className="title">
                    <div>{props.title}</div>
                </Col>
            }
            <Col md={contentColumnWidth}>
                <Row columns={!!blocks.length ? blocks.length : 1}>
                    {
                        blocks
                    }
                </Row>
            </Col>
            {
                props.tooltip &&
                <Col md={2} className="tooltip-container">
                    <TooltipWrapper
                        tooltipText={props.tooltip}
                    />
                </Col>
            }
        </Row>
    </div>
}

export default SeverityBlock;