export const getDetailReport = ({payload, fileType, reportType, isDsr, timezoneInMins}) => (dispatch, getState, api) => {
    return api.report.getDetailReport({payload, fileType, reportType, isDsr, timezoneInMins});
};

export const getSummaryReport = reportFilterPayload => async (dispatch, getState, api) => {
    return await api.report.getSummaryReport(reportFilterPayload);
};