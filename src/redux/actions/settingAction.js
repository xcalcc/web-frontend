export const fetchRetentionPeriod = () => async (dispatch, getState, api) => {
    const callback = await api.setting.getRetentionPeriod();
    return callback;
};

export const saveRetentionPeriod = (retentionPeriod) => async (dispatch, getState, api) => {
    const callback = await api.setting.saveRetentionPeriod(retentionPeriod);
    return callback;
};

export const fetchSetting = (key) => async (dispatch, getState, api) => {
    const callback = await api.setting.getSetting(key);
    return callback;
};

export const updateSetting = ({key, value}) => async (dispatch, getState, api) => {
    const callback = await api.setting.updateSetting({key, value});
    return callback;
};

export const fetchEmailConfiguration = () => async (dispatch, getState, api) => {
    return api.setting.getEmailConfiguration();
};

export const updateEmailConfiguration = (data) => async (dispatch, getState, api) => {
    return api.setting.updateEmailConfiguration(data);
};