import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {ToggleButton, ToggleButtonGroup} from "react-bootstrap";

import './_toggleBtn.scss';

const ToggleButtonGroupControlled = props => {
    const [value, setValue] = useState(props.defaultValue);
    const handleChange = val => {
        setValue(val);
        props.onToggled(val);
    };

    return <ToggleButtonGroup className="toggle-btn-group" type="checkbox" value={value}>
        {
            props.buttons.map((button, idx) => <ToggleButton
                key={idx}
                value={button.value}
                checked={button.value === props.value}
                onChange={() => handleChange(button.value)}
            >{button.label}</ToggleButton>)
        }
    </ToggleButtonGroup>;
}

ToggleButtonGroupControlled.propTypes = {
    buttons: PropTypes.array,
    onToggled: PropTypes.func,
    value: PropTypes.string,
}
ToggleButtonGroupControlled.defaultProps = {
    buttons: [],
    onToggled: () => {},
    value: '',
}

export default ToggleButtonGroupControlled;