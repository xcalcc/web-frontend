export const fetchLatestScanTaskStatus = projectId => async (dispatch, getState, api) => {
    return api.scan.getScanStatus(projectId);
}

export const writeScanProgress = (scanTaskId, status) => (dispatch, getState) => {
    let currentStatus = getState()['scan']['scanProgress'];

    dispatch({
        type: 'SET_SCAN_PROGRESS',
        payload: {
            ...currentStatus,
            [scanTaskId]: status
        }
    });
};

export const fetchScanSummaryByProjectUuid = (projectUuid, filter) => async (dispatch, getState, api) => {
    const scanSummary = await api.scan.getScanSummaryByProjectUuid(projectUuid, filter);
    dispatch({
        type: 'SET_CURRENT_SUMMARY',
        payload: scanSummary
    });
    return scanSummary;
};

export const fetchScanSummaryByScanId = (scanTaskId, filter, currentOrPrevious) => async (dispatch, getState, api) => {
    const scanSummary = await api.scan.getScanSummaryByTaskId(scanTaskId, filter);

    if(currentOrPrevious === 'previous') {
        dispatch({
            type: 'SET_PREVIOUS_SUMMARY',
            payload: scanSummary
        });
    } else {
        dispatch({
            type: 'SET_CURRENT_SUMMARY',
            payload: scanSummary
        });
    }
    return scanSummary;
};

export const fetchScanTaskByProjectUuidAndCommitId = (projectUuid, commitId) => async (dispatch, getState, api) => {
    return api.scan.getScanTaskByProjectUuidAndCommitId({projectUuid, commitId});
};

export const fetchScanLogs = filter => async (dispatch, getState, api) => {
    return api.scan.getScanTaskLog(filter);
};

export const fetchScanTasks = filter => async (dispatch, getState, api) => {
    return api.scan.getScanTasks(filter);
};

export const downloadLogFile = scanTaskId => async (dispatch, getState, api) => {
    return api.scan.downloadLogFile(scanTaskId);
};

export const deleteScanTask = scanTaskId => async (dispatch, getState, api) => {
    return api.scan.deleteScanTask(scanTaskId);
};

export const deleteAllScanTask = projectUuid => async (dispatch, getState, api) => {
    return api.scan.deleteAllScanTask(projectUuid);
};