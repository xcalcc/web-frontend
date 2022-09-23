import React from "react";
import {Col, Row} from "react-bootstrap";
import classNames from "classnames";
import './up-down-one-line-block.scss';

const UpDownOneLineBlock = props => <div className={classNames('up-down-one-line-block', {
    grey: props.grey
})}>
    <Row noGutters>
        <Col md={11}>
            <Row>
                <Col>
                    <div className="block-title">{props.title}</div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div className='block-text'>{props.data}</div>
                </Col>
            </Row>
        </Col>
        <Col md={1}>{
            props.borderRight && <div className="border-right">&nbsp;</div>
        }</Col>
    </Row>
</div>

export default UpDownOneLineBlock;
