import * as utils from "Utils";
import enums from "Enums";

const constructProjectPostData = projectData => {
    let customScanConfig = {};
    projectData.customConfigList.forEach(item => {
        if(!!item.name && !!item.value){
            customScanConfig[item.name] = item.value;
        }
    });

    let postData = {
        projectName: utils.trim(projectData.projectName),
        projectId: utils.trim(projectData.projectId),
        projectConfig: {
            "scanType": "online_agent",
            "uploadFileInfoId": utils.trim(projectData.uploadFileInfoId),
            "sourceStorageName": utils.trim(projectData.sourceStorageName),
            "sourceStorageType": utils.trim(projectData.sourceStorageType),
            "gitUrl": utils.trim(projectData.gitUrl), 
            "relativeSourcePath": utils.trim(projectData.relativeSourcePath),
            "relativeBuildPath": utils.trim(projectData.relativeBuildPath) || '/',
            "uploadSource": projectData.uploadSource,
            "gerritProjectId": utils.trim(projectData.gerritProjectId),
            "username": utils.trim(projectData.username),
            "token": utils.trim(projectData.token),
            "branch": utils.trim(projectData.branch)
        },
        scanConfig: {
            "lang": projectData.lang,
            "scanMemLimit": utils.trim(projectData.scanMemLimit) + 'g',
            "jobQueueName": utils.trim(projectData.jobQueueName) || 'public_default',
            "prebuildCommand": utils.trim(projectData.prebuildCommand),
            "build": utils.trim(projectData.build),
            "builderPath" : utils.trim(projectData.builderPath),
            "buildArgs": utils.trim(projectData.buildArgs),
            ...customScanConfig
        },
        attributes: []
    };

    if(!projectData.gitUrl) {
        postData.projectConfig.scanType = 'offline_agent';
        delete postData.scanConfig.jobQueueName;
    }

    const buildAttributes = (type, configData) => {
        let attrValue;
        let attributes = [];
        for(let key in configData) {
            attrValue = configData[key];
            if(!attrValue) continue;

            attributes.push({
                type: type,
                name: key,
                value: attrValue
            });
        }
        return attributes;
    }

    const projectAttributes = buildAttributes('PROJECT', postData.projectConfig);
    const scanAttributes = buildAttributes('SCAN', postData.scanConfig);
    postData['attributes'] = projectAttributes.concat(scanAttributes);
    return postData;
}

export const fetchProjectList = () => async (dispatch, getState, api) => {
    const callback = await api.project.getProjectList();
    const projectList = callback.content || [];
    dispatch(setProjectList(projectList));
    return projectList;
};

export const fetchProjectListV3 = () => async (dispatch, getState, api) => {
    const callback = await api.project.getProjectListV3();
    const projectList = callback.content || [];
    dispatch(setProjectList(projectList));
    return projectList;
};
export const deleteProject = projectId => async (dispatch, getState, api) => {
    return api.project.deleteProject(projectId);
};
export const fetchConfigByProjectId = (projectId) => async (dispatch, getState, api) => {
    const data = await api.project.getConfigByProjectId(projectId);
    if(data.error) return data;

    let project = data.project || {};
    let attributes = data.attributes || [];

    let config = {};
    let customConfigList = [];
    let scanMode = '';
    attributes.forEach(item => {
        if(item.type === enums.PROJECT_ATTRIBUTE_TYPE.scan && !enums.SCAN_CONFIG_KEY_LIST.includes(item.name)) {
            customConfigList.push({
              id: utils.getRandom(),
              name: item.name,
              value: item.value
            });
        } else {
            config[item.name] = item.value;
        }
    });

    switch(config.scanMode) {
        case enums.SCAN_MODE_ORIGINAL.SINGLE:
            scanMode = enums.SCAN_MODE.SINGLE;
            break;
        case enums.SCAN_MODE_ORIGINAL.CROSS:
            scanMode = enums.SCAN_MODE.CROSS;
            break;
        case enums.SCAN_MODE_ORIGINAL.SINGLE_XSCA:
            scanMode = enums.SCAN_MODE.SINGLE_XSCA;
            break;
        case enums.SCAN_MODE_ORIGINAL.XSCA:
            scanMode = enums.SCAN_MODE.XSCA;
            break;
        default:
            break;
    }
    
    return {
        ...config,
        projectUUID: project.id,
        projectConfigUUID: data.id,
        projectConfigName: data.name,
        projectName: project.name,
        projectId: project.projectId,
        retentionNum: project.retentionNum,
        uploadSource: config.uploadSource === 'true',
        scanMemLimit: config.scanMemLimit ? config.scanMemLimit.replace(/[a-z]/ig, '') : '',
        scanMode,
        customConfigList
    };
}
export const fetchRecentProjectList = () => async (dispatch, getState, api) => {
    const projectList = await api.project.getRecentProjects();
    return projectList;
};
export const createProject = projectData => async (dispatch, getState, api) => {
    const postData = constructProjectPostData(projectData);
    const project = await api.project.createProject(postData);
    return project;
}
export const updateProject = ({projectUUID, projectConfigUUID, projectConfigName, projectData}) => async (dispatch, getState, api) => {
    const postData = constructProjectPostData(projectData);

    let data = await api.project.updateProject(projectUUID, {
        projectId: postData.projectId,
        name: postData.projectName
    });

    if(!data.error) {
        data = await api.project.updateConfig({
            id: projectConfigUUID,
            name: projectConfigName,
            projectConfig: postData.projectConfig,
            scanConfig: postData.scanConfig,
            attributes: postData.attributes
        });
    }

    return data;
}
export const updateProjectData = (projectUUID, projectData) => async (dispatch, getState, api) => {
    return await api.project.updateProject(
        projectUUID,
        projectData
    );
}
export const fetchProjectById = projectId => async (dispatch, getState, api) => {
    const data = await api.project.getProjectById(projectId);
    if(data.error) return data;

    const config = data.projectConfig || {};
    const attributes = config.attributes || [];
    const projectConfig = {}, scanConfig = {};

    attributes.forEach(item => {
        switch(item.type) {
            case enums.PROJECT_ATTRIBUTE_TYPE.project:
                projectConfig[item.name] = item.value;
                break;
            case enums.PROJECT_ATTRIBUTE_TYPE.scan:
                scanConfig[item.name] = item.value;
                break;
            default:
                break;
        }
    });

    data['projectConfig'] = projectConfig;
    data['scanConfig'] = scanConfig;
    data['fullConfigContent'] = JSON.stringify(projectConfig) + "\r\n" + JSON.stringify(scanConfig);

    dispatch({
        type: 'SET_PROJECT_DATA',
        payload: data
    });

    return data;
}
export const fetchProjectUuid = projectKey => async (dispatch, getState, api) => {
    const responseData = await api.project.getProjectConfigByProjectKey(projectKey);
    if(responseData.error) return responseData;
    return responseData.project && responseData.project.id;
};
export const setProjectList = projectList => dispatch => {
    dispatch({
        type: 'SET_PROJECT_LIST',
        payload: projectList
    });
};