import enums from 'Enums';
import * as utils from 'Utils';

export const getPageActions = pageName => {
    switch (pageName) {
        case 'scanResult':
            return {
                setIssueFilter: filter => dispatch => {
                    dispatch({
                        type: 'SET_ISSUE_FILTER',
                        payload: filter
                    });
                },
                setIssuePaging: (issueGroupType, paging) => dispatch => {
                    dispatch({
                        type: 'SET_ISSUE_PAGING',
                        payload: {
                            issueGroupType,
                            paging
                        }
                    });
                },
                resetIssuePaging: () => dispatch => {
                    dispatch({
                        type: 'RESET_ISSUE_PAGING'
                    });
                },
                resetScanResultIssueGroupData: issueGroupType => dispatch => {
                    dispatch({
                        type: 'RESET_SCAN_RESULT_ISSUE_GROUP_DATA',
                        payload: {
                            issueGroupType,
                        }
                    });
                },
                resetScanResultFilter: override => dispatch => {
                    dispatch({
                        type: 'RESET_SCAN_RESULT_FILTER',
                        payload: override
                    });
                },
                toggleAPIOnOff: isOn => dispatch => {
                    dispatch({
                        type: 'TOGGLE_API_ON_OFF',
                        payload: isOn
                    });
                },
                resetScanResultPage: () => dispatch => {
                    dispatch({
                        type: 'SET_DEFAULT_SCAN_RESULT'
                    });
                },
                setScanResultIssueGroupData: (issueGroupType, data) => dispatch => {
                    dispatch({
                        type: 'SET_SCAN_RESULT_ISSUE_GROUP_DATA',
                        payload: {
                            data,
                            issueGroupType
                        }
                    });
                },

                fetchScanSummaryCount: filter => async (dispatch, getState, api) => {
                    const scanSummaryCounts = await api.issue.getIssueGroupCount(filter);

                    dispatch({
                        type: 'SET_CURRENT_SUMMARY_COUNTS',
                        payload: scanSummaryCounts
                    });
                    return scanSummaryCounts;
                },

                fetchScanSummaryCriticalityCount: filter => async (dispatch, getState, api) => {
                    const scanSummaryCriticalityCounts = await api.issue.getIssueGroupCriticalityCount(filter);

                    dispatch({
                        type: 'SET_CURRENT_SUMMARY_CRITICALITY_COUNTS',
                        payload: scanSummaryCriticalityCounts
                    });
                    return scanSummaryCriticalityCounts;
                },

                fetchCriticalityRuleCodeCountForTopIssue: filter => async (dispatch, getState, api) => {
                    const criticalityCounts = await api.issue.getIssueGroupCriticalityCount({
                        ...filter
                    });

                    dispatch({
                        type: 'SET_CRITICALITY_RULE_CCODE_COUNTS',
                        payload: criticalityCounts
                    });
                    return criticalityCounts;
                },

                setScanLogFilter: data => (dispatch, getState, api) => {
                    dispatch({
                        type: 'SET_SCAN_LOG_FILTER',
                        payload: data
                    });
                },
                setScanLogPaging: data => (dispatch, getState, api) => {
                    dispatch({
                        type: 'SET_SCAN_LOG_PAGING',
                        payload: data
                    });
                },
                fetchScanLogs: filter => async (dispatch, getState, api) => {
                    const response = await api.scan.getScanTaskLog(filter);
                    const scanLogsData = getState()['page']['scanResult']['scanLog'].data || [];
                    dispatch({
                        type: 'SET_SCAN_LOG_DATA',
                        payload: {
                            data: scanLogsData.concat(response.content || []),
                            totalPages: response.totalPages
                        }
                    });
                },
            }
        case 'issueDetail':
            return {
                setSingleIssueGroupPageNumber: ({pageNumber, scanTaskId}) => dispatch => {
                    let cacheData = utils.localStore.getDataRow(enums.ISSUE_DETAIL_CACHE_ID) || {};
                    cacheData = {
                        ...cacheData,
                        singleIssueGroupScanTaskId: scanTaskId,
                        singleIssueGroupPageNumber: pageNumber
                    };
                    utils.localStore.setDataRow(enums.ISSUE_DETAIL_CACHE_ID, cacheData);

                    dispatch({
                        type: 'SET_SINGLE_ISSUE_GROUP_PAGE_NUMBER',
                        payload: {
                            singleIssueGroupPageNumber: pageNumber,
                            singleIssueGroupScanTaskId: scanTaskId
                        }
                    });
                },
                setActiveTabId: tabId => dispatch => {
                    dispatch({
                        type: 'SET_ISSUE_DETAIL_ACTIVE_TAB_ID',
                        payload: tabId
                    });
                },
                setTabsDataList: tabsDataList => dispatch => {
                    dispatch({
                        type: 'SET_ISSUE_DETAIL_TABS_DATA_LIST',
                        payload: tabsDataList
                    });
                },
            }
        default: 
            break;
    }
}