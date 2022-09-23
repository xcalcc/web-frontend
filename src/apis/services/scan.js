import axios from "APIs/axios";
import Config from 'APIs/config';

const scan = {
    async getScanStatus(projectId) {
        let callback = {};
        try {
            callback = await axios.get(
                `${Config.scanService}/project/${projectId}/scan_task`
            );
        } catch (e) {
            return {
                error: e
            };
        }
        return callback.data;
    },
    async getScanTaskIds(projectId) {
        let callback = {};
        try {
            callback = await axios.get(
                `${Config.scanService}/project/${projectId}/scan_task/ids`
            );
        } catch (e) {
            return {
                error: e
            };
        }
        return callback.data;
    },
    async getScanSummaryByProjectUuid(projectUuid, filter) {
        let callback = {};
        try {
            callback = await axios.post(
                `${Config.scanService}/project/${projectUuid}/scan_summary`, filter
            );
        } catch (e) {
            return {
                error: e
            };
        }
        return callback.data;
    },
    async getScanSummaryByTaskId(taskId, filter) {
        let callback = {};
        try {
            callback = await axios.post(
                `${Config.scanService}/scan_task/${taskId}/scan_summary`, filter
            );
        } catch (e) {
            return {
                error: e
            };
        }
        return callback.data;
    },
    async getScanTasks({projectUuid, page = 0, size = 15, statusList = null} = {}){
        let callback = {};
        try {
            callback = await axios.get(
                `${Config.scanService}/project/${projectUuid}/scan_tasks`, {
                    params: {
                        page,
                        size,
                        statusList
                    }
                }
            );
        } catch (e) {
            return {
                error: e
            };
        }
        return callback.data;
    },
    async getCompareResult(sourceScanTaskId, targetScanTaskId) {
        let callback = {};
        try {
            callback = await axios.get(
                `${Config.scanService}/scan_task/${sourceScanTaskId}/compare/${targetScanTaskId}`
            );
        } catch (e) {
            return {
                error: e
            };
        }
        return callback.data;
    },
    async downloadLogFile(scanTaskId) {
        let callback = {};
        try {
            callback = await axios.get(
                `${Config.scanService}/scan_task/${scanTaskId}/diagnostic_info`, {
                    responseType: "blob"
                }
            );
        } catch (e) {
            return {
                error: e
            };
        }
        return callback;
    },
    async deleteScanTask(scanTaskId) {
        let callback = {};
        try {
            callback = await axios.delete(
                `${Config.scanService}/scan_task/${scanTaskId}/issues/scan_files`
            );
        } catch (e) {
            return {
                error: e
            };
        }
        return callback.data;
    },
    async deleteAllScanTask(projectUuid) {
        let callback = {};
        try {
            callback = await axios.delete(
                `${Config.projectService}/project/${projectUuid}`, {
                    params: {
                        deleteProjectRecord: "N"
                    }
                }
            );
        } catch (e) {
            return {
                error: e
            };
        }
        return callback.data;
    },
    async getScanTaskLog({
                              projectUuid,
                              commitIdPattern,
                              targetRangeStartDate,
                              targetRangeEndDate,
                              repoActions,
                              ruleSets,
                              page = 1,
                              size = 10,
                          } = {}) {
        try {
            const result = await axios.post(
                `${Config.scanService}/scan_task_log`,
                {
                    projectId: projectUuid,
                    ruleSets,
                    commitIdPattern: commitIdPattern || undefined,
                    targetRangeStartDate: targetRangeStartDate || undefined,
                    targetRangeEndDate: targetRangeEndDate || undefined,
                    repoActions
                },
                {
                    paramsSerializer: function () {
                        let params = [];
                        params.push(`page=${page - 1}`);
                        params.push(`size=${size}`);
                        return params.join("&");
                    }
                }
            );
            return result.data;
        } catch (e) {
            return {
                error: e
            };
        }
    },
    async getScanTaskByProjectUuidAndCommitId({projectUuid, commitId}) {
        let callback = {};
        try {
            callback = await axios.get(
                `${Config.scanService}/project/${projectUuid}/commit/${commitId}`
            );
        } catch (e) {
            return {
                error: e
            };
        }
        return callback.data;
    },
}

export default scan;
