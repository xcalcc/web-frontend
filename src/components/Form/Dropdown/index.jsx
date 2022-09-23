import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {Dropdown} from "react-bootstrap";
import {CaretDownFill} from "react-bootstrap-icons";
import './style.scss';

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <div
        ref={ref}
        className="xdropdown__toggle"
        onClick={(e) => {
            onClick(e);
        }}
    >
      <span className="xdropdown__toggle-text">{children}</span>
      <span className="xdropdown__toggle-icon"><CaretDownFill /></span>
    </div>
));

const XDropdown = props => {
    const {
        className,
        value,
        placeholder,
        options,
        onSelect
    } = props;

    return (
        <Dropdown className={classNames('xdropdown', className)}>
            <Dropdown.Toggle as={CustomToggle}>
                {value || placeholder || (options && options.length > 0 && options[0].label)}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {
                    options.map((option, index) => 
                        <Dropdown.Item 
                            key={index}
                            onSelect={() => onSelect(option)}
                        >
                            {option.label}
                        </Dropdown.Item>
                    )
                }
            </Dropdown.Menu>
        </Dropdown>
    )
};

XDropdown.propTypes = {
    label: PropTypes.string,
    options: PropTypes.array.isRequired
};

XDropdown.defaultProps = {
    options: []
};

export default XDropdown;