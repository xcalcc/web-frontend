import * as utils from "Utils";

export const getUserList = () => async (dispatch, getState, api) => {
    const callback = await api.user.getUserList();
    const userList = (callback && callback.content) || [];
    dispatch({
        type: 'SET_USER_LIST',
        payload: userList
    });
};

export const getUserInfo = () => async (dispatch, getState, api) => {
    const userInfo = await api.user.getCurrentUserInfo();
    dispatch({
        type: 'SET_USER_INFO',
        payload: {
            name: userInfo.username,
            email: userInfo.email,
            group: userInfo.userGroups,
            isAdmin: userInfo.isAdmin === 'Y' ? true : false,
            displayName: userInfo.displayName,
        }
    });

    utils.localStore.set('username', userInfo.username);
    utils.localStore.set('displayname', userInfo.displayName);
    utils.localStore.set('isAdmin', userInfo.isAdmin === 'Y');
}
export const fetchAssigneeList = ({projectUuid, scanTaskId, dsrType, ruleSets}) => async (dispatch, getState, api) => {
    const callback = await api.user.getAssigneeList({projectUuid, scanTaskId, dsrType, ruleSets});
    let assigneeList = [];
    if (callback && !callback.error) {
        assigneeList = callback;
    }
    dispatch({
        type: 'SET_ASSIGNEE_LIST',
        payload: assigneeList
    });
};

export const fetchUserConfig = () => async (dispatch, getState, api) => {
    const callback = await api.user.getUserConfig();
    if (callback && !callback.error) {
        dispatch({
            type: 'SET_USER_CONFIG',
            payload: callback
        });
    }
    return callback;
}

export const updateUserConfig = ({configNumCodeDisplay}) => async (dispatch, getState, api) => {
    return await api.user.updateUserConfig({configNumCodeDisplay});
}
