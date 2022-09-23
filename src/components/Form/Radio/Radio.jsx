import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {Form} from 'react-bootstrap';

import './style.scss';

const XRadio = props => {
    return (
        <div className={classNames('xradio', props.className)}>
            <Form.Check
                type="radio"
                id={props.id || Math.random()}
                name={props.name}
                value={props.value}
                label={props.label}
                checked={props.checked}
                onChange={props.onChange || (() => {})}
                onClick={props.onClick}
            />
            <p className="xradio__hint">{props.hint}</p>
        </div>
    )
};

XRadio.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    label: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    checked: PropTypes.bool,
    onChange: PropTypes.func
};

export default XRadio;