import React from 'react';
import {Row, Col} from "react-bootstrap";
import Button from 'Components/Button';
import Prompt from 'Components/Prompt';

import WarningIcon from 'Icons/warning.svg';
import './confirm-prompt.scss';

const ConfirmPrompt = props => {

    const footer = <Row noGutters>
        <Col className="justify-self-center">
            <Button
                grey
                label={props.cancelBtnText}
                onClick={props.onCancel}
            />
        </Col>
        <Col className="justify-self-center">
            <Button
                red
                label={props.confirmBtnText}
                onClick={props.onConfirm}
            />
        </Col>
    </Row>;

    return <Prompt
        class="confirm-prompt"
        show={props.show}
        title={props.title}
        icon={<img src={WarningIcon} />}
        footer={footer}
        onHide={props.onHide}
    >
        {
            props.contentText && <div className="prompt-body" dangerouslySetInnerHTML={{__html: props.contentText}} />
        }
    </Prompt>
}

export default ConfirmPrompt;
