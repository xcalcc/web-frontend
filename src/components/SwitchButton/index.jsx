import React from 'react';
import Toggle from 'react-toggle';
import classNames from 'classnames';

import 'react-toggle/style.css';
import './style.scss';

const SwitchButton = props => {
    const handleChange = e => {
        e.preventDefault();
        props.onChange && props.onChange(!props.checked);
    };

    return <label className={classNames('switch-button', {checked: props.checked})}>
        {
            props.beforeLabel && <span className="switch-button__label before">{props.beforeLabel}</span>
        }
        <Toggle 
            checked={props.checked}
            onChange={handleChange} 
            icons={false} 
        />
        {
            props.afterLabel && <span className="switch-button__label after">{props.afterLabel}</span>
        }
    </label>
}

export default SwitchButton;