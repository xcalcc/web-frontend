import React from 'react';
import Button from 'Components/Button';
import i18n from 'i18next';
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import * as actions from "Actions";
import Prompt from 'Components/Prompt';

import SuccessIcon from 'Icons/success.svg';
import ErrorIcon from 'Icons/error.svg';
import WarningIcon from 'Icons/warning.svg';
import './alertPrompt.scss';

const AlertPrompt = props => {

    const alerts = useSelector(state => state.app.alerts, shallowEqual);
    const lastAlert = (alerts.length > 0 && alerts[alerts.length-1]) || null;
    const dispatch = useDispatch();

    const popAlert = () => {
        typeof lastAlert.callbackFn === 'function' && lastAlert.callbackFn();
        dispatch(actions.popAlert());
    }

    let icon, classname;
    if (lastAlert) {
        switch(lastAlert.type) {
            case 'message':
                icon = <img src={SuccessIcon} />;
                break;
            case 'error':
                icon = <img src={ErrorIcon} />;
                break;
            case 'warning':
                icon = <img src={WarningIcon} />;
                break;
            default:
                icon = '';
        }
        classname = `alert-prompt ${lastAlert.type}`;
    }

    const footer = <div>
        <Button
            red
            label={props.confirmText || i18n.t('common.buttons.confirm')}
            onClick={popAlert}
        />
    </div>;

    if(!lastAlert) return null;

    return <Prompt
        class={classname}
        show={!!lastAlert}
        icon={icon}
        title={lastAlert && lastAlert.title}
        footer={footer}
        onHide={popAlert}
    >
        {
            lastAlert && <div className="prompt-body" dangerouslySetInnerHTML={{__html: lastAlert.content}} />
        }
    </Prompt>
}

export default AlertPrompt;
