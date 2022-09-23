import React from 'react';
import i18n from 'i18next';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {InfoCircleFill ,ExclamationTriangleFill, XCircleFill} from "react-bootstrap-icons";
import {Toast} from 'react-bootstrap';
import './style.scss';

const XToast = props => {

    let icon;
    switch(props.type) {
        case 'info':
            icon = <InfoCircleFill />;
            break;
        case 'error':
            icon = <XCircleFill />;
            break;
        case 'warning':
            icon = <ExclamationTriangleFill />;
            break;
        default:
            icon = '';
    }

    return <Toast 
        className={classNames('xtoast', props.type, props.className)}
        show={props.show} 
    >
        <div className='xtoast__header'>
            {props.title}
        </div>
        <Toast.Body className='xtoast__body'>
            <div className='xtoast__body-icon'>{icon}</div>
            <div className='xtoast__body-content'>
                {props.children}
            </div>
            <div 
                className='xtoast__body-close'
                onClick={props.onClose}
            >
                {i18n.t('common.dismiss')}
            </div>
        </Toast.Body>
    </Toast>;
}

XToast.propTypes = {
    title: PropTypes.string,
    type: PropTypes.oneOf(['info', 'error', 'warning']),
    show: PropTypes.bool
}
XToast.defaultProps = {
    
}


export default XToast;