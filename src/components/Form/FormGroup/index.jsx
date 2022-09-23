import React from 'react';
import classNames from "classnames";
import {Row, Col, Form} from 'react-bootstrap';
import PropTypes from 'prop-types';

import './style.scss';

const XFormGroup = props => {

    const title = <Form.Label>{props.label}</Form.Label>
    const content = <>
        {props.children}
        {props.error && <Form.Text>{props.error}</Form.Text>}
        {props.hint && <Form.Text muted>{props.hint}</Form.Text>}
    </>;

    const layout = {
        vertical: <>
            {title}
            {content}
        </>,
        horizontal: <>
            <Col md={3}>
                {title}
            </Col>
            <Col md={9}>
                {content}
            </Col>
        </>
    };

    return (
        <Form.Group className={
            classNames(
                "xform-group", 
                props.layout,
                props.className, 
                {invalid: props.error}
            )}
            as={props.layout === 'vertical' ? 'div' : Row}
        >
            {layout[props.layout]}
        </Form.Group>
    )
};

XFormGroup.propTypes = {
    label: PropTypes.string,
    hint: PropTypes.string,
    error: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool
    ]),
    layout: PropTypes.oneOf(['vertical', 'horizontal'])
};

XFormGroup.defaultProps = {
    layout: 'vertical'
}

export default XFormGroup