import React from "react";
import {Col, Row} from "react-bootstrap";
import classNames from "classnames";
import './two-line-left-right-block.scss';


const TwoLineLeftRightBlock = props => <div className={classNames('two-line-left-right-block', {
    grey: props.grey
})}>
    <Row noGutters>
        <Col md={11}>
            <Row>
                <Col md={6}>
                    <div className="block-title">{props.line1.title}</div>
                </Col>
                <Col md={6}>
                    <div className="block-value">{props.line1.data}</div>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <div className="block-title">{props.line2.title}</div>
                </Col>
                <Col md={6}>
                    <div className="block-value">{props.line2.data}</div>
                </Col>
            </Row>
        </Col>
        <Col md={1}>
            {
                props.borderRight && <div className="border-right">&nbsp;</div>
            }
        </Col>
    </Row>
</div>

export default TwoLineLeftRightBlock;
