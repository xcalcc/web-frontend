import produce from "immer";

const initialState = {
    scanResult: {
        filter: {
            ruleSetId: '',
            ruleCodes: [],
            scanFileIds: [],
            includePossibleDefect: true,
            searchValue: '',
            type: '', // Enums.RULE_TYPE: ruleset, standard, custom
            standard: null,
            customRuleSetId: '',
        },
        enableApi: true,
        isReloadIssueGroupList: 0,
        sidebarSummary: {
            groupSummaryCount: {},
            criticalityCount: {}
        },
        general: {
            paging: {
                currentPage: 1,
                pageSize: 15,
                totalIssues: 0,
                totalPages: 0
            },
            data: null, // []
        },
        ignore: {
            paging: {
                currentPage: 1,
                pageSize: 15,
                totalIssues: 0,
                totalPages: 0
            },
            data: null, // []
        },
        dsr_new: {
            paging: {
                currentPage: 1,
                pageSize: 5,
                totalIssues: 0,
                totalPages: 0
            },
            data: null, // []
        },
        dsr_fixed: {
            paging: {
                currentPage: 1,
                pageSize: 5,
                totalIssues: 0,
                totalPages: 0
            },
            data: null, // []
        },
        dsr_outstanding: {
            paging: {
                currentPage: 1,
                pageSize: 5,
                totalIssues: 0,
                totalPages: 0
            },
            data: null, // []
        },
        assigneeList: [],
        scanLog: {
            filter: {
                commitId: null,
                targetStartDate: null,
                targetEndDate: null,
                repoActions: null, // ['CI', 'CD']
            },
            paging: {
                currentPage: 1,
                pageSize: 50,
            },
            data: null, // []
            totalPages: 0,
        },
        topIssue: {
            criticalityCountMap: {}
        },
    },
    issueDetail: {
        activeTabId: '',
        tabsDataList: null,
        singleIssueGroupScanTaskId: null,
        singleIssueGroupPageNumber: null,
    }
};

const pageReducer = produce((draft, action) => {
    switch (action.type) {
        case 'SET_ISSUE_FILTER':
            draft['scanResult'].filter = action.payload;
            draft['scanResult']['general']['paging'] = {
                ...draft['scanResult']['general']['paging'],
                currentPage: 1
            };
            break;
        case 'SET_ISSUE_PAGING':
            const {
                issueGroupType, 
                paging
            } = action.payload;
            draft['scanResult'][issueGroupType].paging = paging;
            break;
        case 'RESET_ISSUE_PAGING':
            draft['scanResult']['general']['paging'] = initialState.scanResult.general.paging;
            draft['scanResult']['dsr_new']['paging'] = initialState.scanResult.dsr_new.paging;
            draft['scanResult']['dsr_fixed']['paging'] = initialState.scanResult.dsr_fixed.paging;
            draft['scanResult']['dsr_outstanding']['paging'] = initialState.scanResult.dsr_outstanding.paging;
            break;
        case 'SET_DEFAULT_SCAN_RESULT':
            draft['scanResult'] = initialState.scanResult;
            break;
        case 'RESET_SCAN_RESULT_FILTER':
            draft['scanResult'].filter = {
                ...initialState.scanResult.filter,
                ...action.payload
            };
            break;
        case 'RESET_SCAN_RESULT_ISSUE_GROUP_DATA':
            draft['scanResult'][action.payload.issueGroupType] = {
                ...initialState.scanResult[action.payload.issueGroupType],
                data: []
            };
            break;
        case 'TOGGLE_API_ON_OFF':
            draft['scanResult'].enableApi = action.payload;
            break;
        case 'IS_RELOAD_ISSUE_GROUP_LIST':
            draft['scanResult'].isReloadIssueGroupList = action.payload;
            break;
        case 'SET_SCAN_RESULT_ISSUE_GROUP_DATA':
            draft['scanResult'][action.payload.issueGroupType] = action.payload.data;
            break;
        case 'SET_CURRENT_SUMMARY_COUNTS':
            draft['scanResult'].sidebarSummary.groupSummaryCount = action.payload;
            break;
        case 'SET_CURRENT_SUMMARY_CRITICALITY_COUNTS':
            draft['scanResult'].sidebarSummary.criticalityCount = action.payload;
            break;
        case 'SET_CRITICALITY_RULE_CCODE_COUNTS':
            draft['scanResult'].topIssue.criticalityCountMap = action.payload;
            break;
        case 'SET_ASSIGNEE_LIST':
            draft['scanResult'].assigneeList = action.payload;
            break;
        case 'SET_SCAN_LOG_DATA':
            draft['scanResult'].scanLog.data = action.payload.data;
            draft['scanResult'].scanLog.totalPages = action.payload.totalPages;
            break;
        case 'SET_SCAN_LOG_FILTER':
            draft['scanResult'].scanLog.filter = action.payload;
            draft['scanResult'].scanLog.data = null;
            draft['scanResult'].scanLog.totalPages = 0;
            draft['scanResult'].scanLog.paging = {
                ...draft['scanResult'].scanLog.paging,
                currentPage: 1
            }
            break;
        case 'SET_SCAN_LOG_PAGING':
            draft['scanResult'].scanLog.paging = action.payload;
            break;
        case 'SET_ISSUE_DETAIL_ACTIVE_TAB_ID':
            draft['issueDetail'].activeTabId = action.payload;
            break;
        case 'SET_ISSUE_DETAIL_TABS_DATA_LIST':
            draft['issueDetail'].tabsDataList = action.payload;
            break;
        case 'SET_SINGLE_ISSUE_GROUP_PAGE_NUMBER':
            const {
                singleIssueGroupPageNumber, 
                singleIssueGroupScanTaskId
            } = action.payload;
            draft['issueDetail'].singleIssueGroupPageNumber = singleIssueGroupPageNumber;
            draft['issueDetail'].singleIssueGroupScanTaskId = singleIssueGroupScanTaskId;
            break;
        default:
            break;
    }
}, initialState);

export default pageReducer;
