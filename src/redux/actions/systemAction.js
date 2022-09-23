export const contactUs = data => async (dispatch, getState, api) => {
    return api.system.contactUs(data);
};

export const fetchVersion = () => async (dispatch, getState, api) => {
    return api.system.getVersion();
};