import React from 'react';
import classNames from "classnames";
import PropTypes from 'prop-types';
import {Modal} from "react-bootstrap";

import './prompt.scss';

const Prompt = props => {

    return <Modal
        centered
        show={props.show}
        onHide={props.onHide}
        dialogClassName={classNames("global-prompt", props.class)}
        aria-labelledby="contained-modal-title-vcenter"
    >
        <div className="header">
            <div className="icon-container">
                <div className="icon">
                    {props.icon}
                </div>
            </div>
            <h2 className="title">
                {
                    props.title
                }
            </h2>
        </div>
        <Modal.Body>
            {props.children}
        </Modal.Body>
        <Modal.Footer className="footer">
            {props.footer}
        </Modal.Footer>
    </Modal>
}
Prompt.propTypes = {
    titles: PropTypes.array,
}
Prompt.defaultProps = {
    titles: []
}

export default Prompt;
