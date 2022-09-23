import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {Form} from 'react-bootstrap';

import './style.scss';

const XInput = props => {
    return (
        <Form.Control
            {...props}
            type={props.type || 'text'}
            name={props.name}
            defaultValue={props.defaultValue}
            placeholder={props.placeholder}
            className={classNames('xinput', props.className)}
            onChange={props.onChange}
            onKeyUp={props.onKeyUp}
        />
    )
};

XInput.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    placeholder: PropTypes.string
};

export default XInput;