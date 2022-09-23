import axios from "APIs/axios";
import Config from 'APIs/config';

const issueService = {
    async searchIssueList({
                              page = 0,
                              size = 10,
                              scanTaskId,
                              projectId,
                              ruleSetId,
                              ruleInformationIds,
                              issueAttributes,
                              scanFileIds,
                              searchIssueType,
                              seq,
                              sort
                          } = {}) {
        return axios.post(
            `${Config.issueService}/search_issue`,
            {
                scanTaskId,
                projectId,
                ruleSetId,
                ruleInformationIds,
                issueAttributes,
                scanFileIds,
                searchIssueType,
                seq
            },
            {
                paramsSerializer: function () {
                    let params = [];
                    params.push(`page=${page - 1}`);
                    params.push(`size=${size}`);
                    sort && sort.forEach(v => {
                        params.push(`sort=${v}`);
                    });
                    return params.join("&");
                }
            }
        );
    },
    async searchIssueGroup({
                              page = 0,
                              size = 10,
                              scanTaskId,
                              projectId,
                              ruleSets,
                              ruleCodes,
                              scanFileIds,
                              pathCategory,
                              certainty,
                              dsrType,
                              searchValue,
                              sort
                          } = {}) {
        try {
            const result = await axios.post(
                `${Config.issueServiceV3}/search_issue_group`,
                {
                    scanTaskId,
                    projectId,
                    ruleSets,
                    ruleCodes,
                    scanFileIds,
                    pathCategory,
                    certainty,
                    dsrType,
                    searchValue
                },
                {
                    paramsSerializer: function () {
                        let params = [];
                        params.push(`page=${page - 1}`);
                        params.push(`size=${size}`);
                        sort && sort.forEach(x => {
                            params.push(`sort=${x}`);
                        });
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
    async assignIssueAction({
                                issueId,
                                action
                            }) {
        return axios.post(
            `${Config.issueService}/issue/${issueId}/action/${action}`, {
                id: issueId,
                action
            }
        );
    },
    async assignIssueUser(issueGroupId,
                          userId) {
        try {
            const result = await axios.post(`${Config.issueServiceV3}/issue_group/${issueGroupId}/user/${userId}`);
            return result.data;
        } catch (e) {
            return {
                error: e
            };
        }
    },
    async getIssue(issueId) {
        return axios.get(`${Config.issueService}/issue/${issueId}`);
    },
    async getIssueListByGroupId(scanTaskId, issueGroupId, page, size= 500) {
        let callback = {};
        try {
            callback = await axios.get(
                `${Config.issueServiceV3}/scan_task/${scanTaskId}/issue_group/${issueGroupId}/issues`,
                {
                    paramsSerializer: function () {
                        let params = [];
                        params.push(`page=${page - 1}`);
                        params.push(`size=${size}`);
                        return params.join("&");
                    }
                }
            );
        } catch (e) {
            return { error: e };
        }
        return callback.data;
    },
    async getIssueInfo({
                           issueCategory,
                           issueCode
                       }) {
        return axios.get(
            `${Config.issueService}/issue_info`, {
                params: {
                    issueCategory,
                    issueCode
                }
            }
        );
    },
    async assignIssues({
                           assignIssues = []
                       }) {
        return axios.post(
            `${Config.issueService}/issues/users`, {
                assignIssues
            }
        );
    },
    async emailIssues({
                          assignIssues = []
                      }) {
        return axios.post(
            `${Config.issueService}/issues/users/email`, {
                assignIssues
            }
        );
    },
    async getIssueSummaryCountBySeverity(projectId) {
        return axios.get(`${Config.issueService}/project/${projectId}/issue_severitysummary`);
    },
    async getIssueListByIds(issueIds) {
        return axios.post(
            `${Config.issueService}/issues`, {
                issueIds
            }
        );
    },
    async getIssueGroupById(scanTaskId, issueGroupId) {
        let callback = {};
        try {
            callback = await axios.get(
                `${Config.issueServiceV3}/scan_task/${scanTaskId}/issue_group/${issueGroupId}`
            );
        } catch (e) {
            return { error: e };
        }
        return callback.data;
    },

    async getIssueGroupCount(filterObj) {
        let callback = {};
        try {
            callback = await axios.post(
                `${Config.issueServiceV3}/issue_group_count`,
                filterObj
            );
        } catch (e) {
            return {};
        }
        return callback.data;
    },
    async getIssueGroupCriticalityCount(filterObj) {
        let callback = {};
        try {
            callback = await axios.post(
                `${Config.issueServiceV3}/issue_group_criticality_count`,
                filterObj
            );
        } catch (e) {
            return {};
        }
        return callback.data;
    },
    async getSearchSuggest(filterObj, page, size) {
        let callback = {};
        try {
            callback = await axios.post(
                `${Config.issueServiceV3}/search-suggest`,
                filterObj,
                {
                    paramsSerializer: function () {
                        let params = [];
                        params.push(`page=${page - 1}`);
                        params.push(`size=${size}`);
                        return params.join("&");
                    }
                }
            );
        } catch (e) {
            return { error: e };
        }
        return callback.data;
    },
};
export default issueService;
