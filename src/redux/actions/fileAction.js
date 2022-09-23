import enums from "Enums";
import * as utils from "Utils";

export const fetchFileStorageList = () => async (dispatch, getState, api) => {
    const callback = await api.file.getFileStorageList();
    let result = [];
    let dataList = callback.content || [];

    dataList = dataList.filter(x => x.status === "ACTIVE" && enums.SCM_TYPE_LIST.findIndex(scm => scm.value === x.fileStorageType) > -1);

    result.push(
        {
            label: utils.language("agent_client"),
            name: enums.FILE_STORAGE_AGENT_NAME,
            fileStorageType: enums.FILE_STORAGE_TYPE.agent,
            description: utils.language("agent_client"),
            fileStorageHost: null
        }
    );

    dataList.forEach(item => {
        result.push({
            label: item.name,
            name: item.name,
            fileStorageType: item.fileStorageType,
            description: item.description,
            fileStorageHost: item.fileStorageHost
        });
    });

    dispatch({
        type: 'SET_FILE_STORAGE_LIST',
        payload: result
    });

    return result;
};
export const fetchProjectDirectory = (payload = {
    page: 0,
    size: 100,
    scanTaskId: '',
    scanFileIds: [],
    depth: 2
}) => async (dispatch, getState, api) => {
    const response = await api.file.getDirectoryTree(payload);
    return response;
};
export const fetchScanFile = ({scanTaskId, dsrType, filePath, fromLineNo, toLineNo, linesLimit}) => async (dispatch, getState, api) => {
    const response = await api.file.getScanFile({scanTaskId, dsrType, filePath, fromLineNo, toLineNo, linesLimit});
    return response;
}