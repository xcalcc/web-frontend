import * as utils from "Utils";

export const login = (username, password) => async (dispatch, getState, api) => {
    const callback = await api.auth.login(username, password);
    return callback;
};

export const logout = () => dispatch => {
    sessionStorage.removeItem("dev_mode_option");
    utils.localStore.remove("tokenType");
    utils.localStore.remove("accessToken");
    utils.localStore.clearAll();
    dispatch({
        type: 'SET_USER_INFO',
        payload: {}
    });
}

export const isLogin = () => () =>  {
    const tokenType = utils.localStore.get("tokenType");
    const accessToken = utils.localStore.get("accessToken");

    return !!(tokenType && accessToken);
}

export const generateAccessToken = (tokenName, expireDays) => async (dispatch, getState, api) => {
    const callback = await api.auth.generateAccessToken(tokenName, expireDays);
    return callback;
};

export const fetchAccessTokenList = () => async (dispatch, getState, api) => {
    const callback = await api.auth.getAccessTokenList();
    return callback;
};

export const deleteAccessToken = (id) => async (dispatch, getState, api) => {
    const callback = await api.auth.deleteAccessToken(id);
    return callback;
};