import React from 'react';
import classNames from "classnames";
import {Button} from 'react-bootstrap';
import './button.scss';

const XButton = props => {
    let formatProps = {};
    /* 
     * resolve React warning, e.g Warning: Received `true` for a non-boolean attribute `red`.
     * DOM attribute value cannot be Boolean in React
    */
    Object.keys(props).forEach(key => {
        if(typeof props[key] === 'boolean') {
            formatProps[key] = String(props[key]);
        } else {
            formatProps[key] = props[key];
        }
    });

    return <Button
        {...formatProps}
        className={classNames('xbutton', props.className, {
            red: props.red,
            grey: props.grey,
            blue: props.blue,
        })}
        disabled={props.disabled}
        onClick={props.onClick}
        type={props.type}
    >
        {props.icon && <span className="icon">{props.icon}</span>}
        {props.label}
    </Button>
}

export default XButton;
