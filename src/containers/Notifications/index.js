import React from 'react';
import XToast from 'Components/Toast';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import * as actions from 'Actions';
import './style.scss';

const Notifications = props => {
    const dispatch = useDispatch();
    const notifications = useSelector(state => state.app.notifications, shallowEqual);
    let _notifications = [...notifications].reverse();
    _notifications = _notifications.filter(x => x.level === 'global' || x.path === props.pageName);

    const onClose = (notify) => {
        notify.callbackFn && notify.callbackFn();
        dispatch(actions.removeNotification(notify.id));
    }

    if(_notifications.length === 0) {
        return null;
    }

    return <div className="notification-wrapper">
        {
            _notifications.map((notify, idx) => 
                <XToast
                    key={notify.id}
                    show={true}
                    type={notify.type}
                    onClose={() => onClose(notify)}
                >
                    {notify.content}
                </XToast>
            )
        }
    </div>
}

export default Notifications;