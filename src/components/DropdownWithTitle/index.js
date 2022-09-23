import classNames from "classnames";
import React from "react";
import {Dropdown} from "react-bootstrap";
import PropTypes from 'prop-types';

import './style.scss';

const DropDownWithTitle = props => {
    const CustomToggle = React.forwardRef(({children, onClick}, ref) => (
        <div
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
        >
            <span className="label">{children}</span>
            {
                props.icon ? <span className="icon">{props.icon}</span> : <span className="icon">&#8964;</span>
            }

        </div>
    ));
    return <div className={classNames(props.class, "dropdown-with-title")}>
        <div className="title">
            {props.title}
        </div>
        <div className="drop-down">
            <Dropdown>
                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                    {props.label}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {
                        props.menuGroups && props.menuGroups.map((menuGroup, idx) => <div key={idx}>
                            {
                                menuGroup.header ?
                                    <Dropdown.Header>
                                        {menuGroup.header}
                                    </Dropdown.Header> :
                                    ''
                            }
                            {
                                menuGroup.menus.map((menu, idx) =>
                                    <Dropdown.Item
                                        eventKey={idx}
                                        key={idx}
                                        onSelect={() => menu.onSelect({
                                            label: menu.label,
                                            value: menu.value,
                                        })}
                                    >
                                        {menu.label}
                                    </Dropdown.Item>)
                            }
                            {
                                props.menuGroups && props.menuGroups.length - idx > 1 &&
                                <Dropdown.Divider/>
                            }
                        </div>)
                    }
                </Dropdown.Menu>
            </Dropdown>
        </div>
    </div>
}

DropDownWithTitle.propTypes = {
    title: PropTypes.string,
}
DropDownWithTitle.defaultProps = {
    title: '',
    label: 'menu1',
    menuGroups: [
        {
            header: 'test',
            menus: [
                {
                    label: 'menu1',
                    value: 1,
                    onSelect: () => console.log('menu1 selected'),
                }
            ]
        }
    ]
}

export default DropDownWithTitle;
