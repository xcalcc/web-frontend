import React from 'react';
import classNames from 'classnames';
import {Dropdown} from 'react-bootstrap';
import PropTypes from 'prop-types';

import './style.scss';

const CustomDropdown = props => {
    const {
        alignment,
        label,
        options,
        selectedValue,
        isShow,
        onToggle,
        onSelect,
        icon,
        optionIcon,
        arrowStyle,
    } = props;

    return <Dropdown 
        show={isShow} 
        className={classNames("custom-dropdown", alignment)}
        onToggle={onToggle}
    >
        <Dropdown.Toggle variant="custom">
            {icon && <span className="dropdown-icon">{icon}</span>}
            {label}
            <span className={classNames("arrow-icon", {[arrowStyle]: arrowStyle})}></span>
        </Dropdown.Toggle>
        <Dropdown.Menu>
            {
                options && options.map((option, index) => 
                    option.divider ? 
                    <Dropdown.Divider/> :
                    <Dropdown.Item 
                        key={index}
                        className={classNames({active: option.value === selectedValue})}
                        onSelect={() => onSelect(option)}
                    >
                        {optionIcon && <span className="item-icon">{optionIcon}</span>}
                        {option.icon && <span className="item-icon">{option.icon}</span>}
                        {option.label}
                    </Dropdown.Item>
                )
            }
            
            {props.children}
        </Dropdown.Menu>
    </Dropdown>
}

CustomDropdown.propTypes = {
    alignment: PropTypes.oneOf(['left', 'right']),
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element
    ]),
    icon: PropTypes.element,
    optionIcon: PropTypes.element,
    options: PropTypes.array,
    children: PropTypes.element,
    selectedValue: PropTypes.string,
    isShow: PropTypes.bool,
    arrowStyle: PropTypes.oneOf(['line', 'fill']),
    onToggle: PropTypes.func,
    onSelect: PropTypes.func
}

CustomDropdown.defaultProps = {
    alignment: 'left',
    arrowStyle: 'fill'
    // isShow: false
}

export default CustomDropdown;