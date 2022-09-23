import *  as utils from 'Utils';

export const setCache = (cacheId, data) => dispatch => {
    utils.localStore.set(cacheId, data);
    dispatch({
        type: 'SET_CACHE',
        payload: {
            cacheId: data
        }
    });
}
export const clearCache = () => dispatch => {
    dispatch({
        type: 'CLEAR_CACHE',
    });
}
export const getCache = cacheId => (dispatch, getState) => {
    return getState()['cache']['cacheId'] || utils.localStore.get(cacheId);
}