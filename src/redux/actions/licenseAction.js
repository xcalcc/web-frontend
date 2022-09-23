export const fetchLicense = () => (dispatch, getState, api) => {
    return api.license.getLicense();
};

export const uploadLicense = formData => async (dispatch, getState, api) => {
    return api.license.uploadLicense(formData);
};