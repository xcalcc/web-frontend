import React, {useState} from 'react';
import classNames from "classnames";
import {Accordion, Card} from 'react-bootstrap';
import {ChevronDown} from 'react-bootstrap-icons';
import * as utils from 'Utils';

import './style.scss';
import PropTypes from "prop-types";

const XAccordion = props => {
    const [isShow, setIsShow] = useState(props.show);
    const handleSelect = data => {
        props.onSelect && props.onSelect(data);
    }

    return <Accordion 
                defaultActiveKey={props.show ? "0" : null} 
                bsPrefix={classNames("x-accordion", {show: isShow})}
                onSelect={status => setIsShow(status !== null)}
            >
                <Accordion.Toggle as={Card.Header} eventKey="0">
                    {props.title}
                    <ChevronDown className="icon"/>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                    <div>
                        <ul>
                            {
                                props.items && props.items.map((item, idx) => {
                                    return <li
                                        key={idx}
                                        onClick={() => handleSelect(item)}
                                        className={classNames({
                                            selected: props.selected && props.selected.includes(item.id)
                                        })}
                                    >
                                        <strong>{item.label}</strong>
                                        <span>{props.formatNumber? utils.formatNumber(item.value) : item.value}</span>
                                    </li>;
                                })
                            }
                        </ul>
                        {props.children}
                    </div>
                </Accordion.Collapse>
            </Accordion>;
}
XAccordion.defaultProps = {
    title: '',
    onSelect: () => {},
    show: false,
    items: [],
    formatNumber: false,
    selected: false,
    groupId: '',
}
XAccordion.propTypes = {
    title: PropTypes.string,
    onSelect: PropTypes.func,
    show: PropTypes.bool,
    items: PropTypes.array,
    formatNumber: PropTypes.bool,
    selected: PropTypes.bool,
    groupId: PropTypes.string,
}

export default XAccordion;