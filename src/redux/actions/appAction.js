import produce from 'immer';

export const fetchAppInfo = () => async (dispatch, getState, api) => {
    const appData = await api.system.getVersion();
    dispatch({
        type: 'SET_APP_INFO',
        payload: appData
    });
};

/**
 *
 * @param alertObj {type: "error/warning/message", content: String, title: String}
 * @returns {function(...[*]=)}
 */
export const pushAlert = alertObj => (dispatch, getState) => {
    const alertState = getState()['app']['alerts'];
    const existsSameContent = alertState.find(alert => alert.content === alertObj.content);
    if(existsSameContent) return;
    dispatch({
        type: 'ALTER_ALERT',
        payload: produce(alertState, draftState => {
            draftState.push(alertObj)
        })
    });
}
export const popAlert = () => (dispatch, getState) => {
    const alertState = getState()['app']['alerts'];
    let newAlerts = produce(alertState, draftState => {
        draftState.pop();
    });
    dispatch({
        type: 'ALTER_ALERT',
        payload: newAlerts
    });
}

/**
 * Add Notification
 *
 * @param notificationObj
 *  {
 *      id: String
 *      level: "global/page"
 *      path: URL
 *      type: "info/warning/error"
 *      title: String
 *      content: String
 *      callbackFn: Function
 *  }
 * @returns {function(...[*]=)}
 */
export const pushNotification = notificationObj => (dispatch, getState) => {
    const notificationState = getState()['app']['notifications'];
    dispatch({
        type: 'SET_NOTIFICATION',
        payload: produce(notificationState, draftState => {
            if(draftState.findIndex(x => x.id === notificationObj.id) === -1) {
                draftState.push(notificationObj);
            }
        })
    });
}
export const removeNotification = id => (dispatch, getState) => {
    const notificationState = getState()['app']['notifications'];
    dispatch({
        type: 'SET_NOTIFICATION',
        payload: produce(notificationState, draftState => draftState.filter(x => x.id !== id))
    });
}

export const setLocale = locale => dispatch => {
    dispatch({
        type: 'SET_LOCALE',
        payload: locale
    });
    localStorage.setItem('language', locale);
    //todo remove below ultimately when all relied on redux
    window.location.reload();
};

export const pushUrl = urlPathname => (dispatch, getState) => {
    const storageLimit = 10;
    const urlHistoryList = getState()['app']['urlHistoryList'];

    dispatch({
        type: 'SET_URL_HISTORY',
        payload: produce(urlHistoryList, draftState => {
            const latestUrl = draftState[draftState.length - 1];
            if(latestUrl === urlPathname) return;

            if(draftState.length === storageLimit) {
                draftState.shift();
            }
            draftState.push(urlPathname);
        })
    });
};

export const getPreviousUrl = () => (dispatch, getState) => {
    const urlHistoryList = getState()['app']['urlHistoryList'];
    return urlHistoryList[urlHistoryList.length - 2] || '';
};