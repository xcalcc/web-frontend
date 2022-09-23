import axios from "APIs/axios";
import Config from 'APIs/config';

const project = {

    async getProjectById(id) {
        let callback = {};
        try {
            callback = await axios.get(
                `${Config.projectService}/project/${id}`
            );
        } catch (e) {
            return {
                error: e
            };
        }
        return callback.data;
    },

    async getProjectList({
                             page = 0,
                             size = 500,
                             sort
                         } = {}) {
        let callback = {};
        try {
            callback = await axios.get(
                `${Config.projectService}/projects`, {
                    params: {
                        page,
                        size,
                        sort
                    }
                }
            );
        } catch (e) {
            return {};
        }
        return callback.data;
    },

    async getProjectListV3({
                               page = 0,
                               size = 1000,
                               sort
                           } = {}) {
        let callback = {};
        try {
            callback = await axios.get(`${Config.projectServiceV3}/project_summaries`, {
                    params: {
                        page,
                        size,
                        sort
                    }
                }
            );
            return callback.data;
        } catch (e) {
            return {};
        }
    },

    async createProject({
                            projectName,
                            projectId,
                            configName,
                            projectConfig = {},
                            scanConfig = {},
                            attributes = {}
                        }) {
        let callback = {};
        try {
            callback = await axios.post(
                `${Config.projectService}/project`, {
                    projectName,
                    projectId,
                    configName,
                    projectConfig,
                    scanConfig,
                    attributes
                });
        } catch (e) {
            return {
                error: e
            };
        }
        return callback.data;
    },

    async getConfigByProjectId(projectId) {
        let callback = {};
        try {
            callback = await axios.get(
                `${Config.projectService}/project/${projectId}/config`
            );
        } catch (e) {
            return {
                error: e
            };
        }
        return callback.data;
    },

    async deleteProject(id) {
        let callback = {};
        try {
            callback = await axios.delete(
                `${Config.projectServiceV3}/project/${id}`
            );
        } catch (e) {
            return {};
        }
        return callback;
    },

    async getDefaultProjectConfigs() {
        let callback = {};
        try {
            callback = await axios.get(`${Config.projectService}/configs`);
        } catch (e) {
            return {};
        }
        return callback.data;
    },

    async getPresetList() {
        let callback = {};
        try {
            callback = await axios.get(`${Config.projectService}/configs`);
        } catch (e) {
            return {};
        }
        return callback.data;
    },

    async getPresetById(id) {
        let callback = {};
        try {
            callback = await axios.get(
                `${Config.projectService}/config/${id}`
            );
        } catch (e) {
            return {};
        }
        return callback.data;
    },

    async addPreset({
                        name,
                        projectConfig,
                        scanConfig
                    }) {
        let callback = {};
        try {
            callback = await axios.post(
                `${Config.projectService}/config`, {
                    name,
                    projectConfig,
                    scanConfig
                });
        } catch (e) {
            return {};
        }
        return callback.data;
    },

    async updateProject(id, projectData) {
        let callback = {};
        try {
            callback = await axios.put(
                `${Config.projectService}/project/${id}`, {
                    id,
                    ...projectData
                });
        } catch (e) {
            return {
                error: e
            };
        }
        return callback.data;
    },

    async updateConfig({
                           id,
                           name,
                           projectConfig,
                           scanConfig,
                           attributes
                       }) {
        let callback = {};
        try {
            callback = await axios.put(
                `${Config.projectService}/config/${id}`, {
                    id,
                    name,
                    projectConfig,
                    scanConfig,
                    attributes
                });
        } catch (e) {
            return {
                error: e
            };
        }
        return callback.data;
    },

    async deletePreset(id) {
        let callback = {};
        try {
            callback = await axios.delete(
                `${Config.projectService}/config/${id}`, {
                    params: {
                        id
                    }
                }
            );
        } catch (e) {
            return {};
        }
        return callback.data;
    },

    async getRecentProjects() {
        let callback = {};
        try {
            callback = await axios.get(`${Config.projectService}/projects/recent`);
        } catch (e) {
            return {};
        }
        return callback.data;
    },

    async uploadFile(formData) {
        let callback = {};
        try {
            callback = await axios.post(`${Config.projectService}/sourcecode`, formData, {
                timeout: 0,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
        } catch (e) {
            return {};
        }
        return callback.data;
    },

    async getProjectConfigByProjectKey(projectKey) {
        let callback = {};
        try {
            callback = await axios.get(`${Config.projectService}/project/project_id/${projectKey}/config`);
        } catch (e) {
            return {
                error: e
            };
        }
        return callback.data;
    },
}

export default project;
