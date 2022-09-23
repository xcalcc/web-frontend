import React from "react";
import Proptypes from 'prop-types';
import {CaretDownFill} from "react-bootstrap-icons";
import {Col, Dropdown, Row} from "react-bootstrap";
import './drop-down-block.scss';

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
        href=""
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    >
        <span className="icon">
            <CaretDownFill />
        </span>
        <span className="text">{children}</span>
    </a>
));

const DropDownTwoLines = props => {
    const trigger = (props.title && <span> {props.title} </span>) || '';

    return <div className="drop-down-two-lines">
        <Row noGutters>
            <Col md={11}>
                <Row>
                    <Col>
                        <Dropdown>
                            <Dropdown.Toggle as="a" id="dropdown-basic">
                                {
                                    trigger
                                }
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {
                                    props.options.length && props.options.map((option, idx) =>
                                        <Dropdown.Item
                                            key={idx}
                                            onClick={() => props.onSelect(idx)}
                                        >
                                            {option.label}
                                        </Dropdown.Item>)
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {props.valueLabel}
                    </Col>
                </Row>
            </Col>
            <Col md={1}>{
                props.borderRight && <div className="border-right">&nbsp;</div>
            }</Col>
        </Row>
    </div>
}

const DropDownOneLine = props => {

    return <div className="drop-down-one-line">
        <Dropdown>
            <Dropdown.Toggle as={CustomToggle}>
                {props.valueLabel || ''}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {
                    props.options.length && props.options.map((option, idx) =>
                        <Dropdown.Item
                            key={idx}
                            onClick={() => props.onSelect(idx)}
                        >
                            {option.label}
                        </Dropdown.Item>)
                }
            </Dropdown.Menu>
        </Dropdown>
    </div>;
}

const DropDownBlock = props => {
    let content = '';

    const handleSelect = index => {
        props.handleChange(index);
    }
    if (props.type === 'oneLine') {
        content = <DropDownOneLine
            {...props}
            valueLabel={props.currentOption.displayName}
            onSelect={handleSelect}
        />;
    } else {
        content = <DropDownTwoLines
            {...props}
            onSelect={handleSelect}
            valueLabel={props.currentOption.displayName}
        />;
    }

    return <div className="drop-down-block">
        {
            content
        }
    </div>
}
DropDownBlock.propTypes = {
    options: Proptypes.array,
    type: Proptypes.oneOf(['oneLine', 'twoLines'])
}
DropDownBlock.defaultProps = {
    options: [],
    type: 'twoLines'
}

export default DropDownBlock;
