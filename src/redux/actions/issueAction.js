import enums from "Enums";
import * as utils from 'Utils';

const getTracePathDescription = (functionName, variableName, issue, msg_templ) => {
    let source, sink;

    if(!issue || !issue.tracePath) return '';

    source = issue.tracePath[0] || {};
    sink = issue.tracePath[issue.tracePath.length-1] || {};

    return (msg_templ || '')
        .replace(new RegExp('\\' + enums.RULE_MSG_TEMPL_KEYWORDS.source.file, 'ig'), source.file)
        .replace(new RegExp('\\' + enums.RULE_MSG_TEMPL_KEYWORDS.source.filename, 'ig'), source.file)
        .replace(new RegExp('\\' + enums.RULE_MSG_TEMPL_KEYWORDS.source.line, 'ig'), source.lineNo)
        .replace(new RegExp('\\' + enums.RULE_MSG_TEMPL_KEYWORDS.source.func, 'ig'), functionName)
        .replace(new RegExp('\\' + enums.RULE_MSG_TEMPL_KEYWORDS.source.variable, 'ig'), variableName)

        .replace(new RegExp('\\' + enums.RULE_MSG_TEMPL_KEYWORDS.sink.file, 'ig'), sink.file)
        .replace(new RegExp('\\' + enums.RULE_MSG_TEMPL_KEYWORDS.sink.filename, 'ig'), sink.file)
        .replace(new RegExp('\\' + enums.RULE_MSG_TEMPL_KEYWORDS.sink.line, 'ig'), sink.lineNo)
        .replace(new RegExp('\\' + enums.RULE_MSG_TEMPL_KEYWORDS.sink.func, 'ig'), functionName)
        .replace(new RegExp('\\' + enums.RULE_MSG_TEMPL_KEYWORDS.sink.variable, 'ig'), variableName);
}

export const getPayloadOfSearchIssue = ({isDsrPage, isMisraPage, scanTaskId, currentFilter, validationFilterType, pageNumber, pageSize}) => (dispatch, getState) => {
    let pathCategory = undefined;
    let scanFileIds = currentFilter.scanFileIds.filter(x => x !== enums.SEARCH_ISSUE_TYPE.ONLY_PROJECT && x !== enums.SEARCH_ISSUE_TYPE.ONLY_NON_PROJECT);
    const inProject = currentFilter.scanFileIds.includes(enums.SEARCH_ISSUE_TYPE.ONLY_PROJECT);
    const outProject = currentFilter.scanFileIds.includes(enums.SEARCH_ISSUE_TYPE.ONLY_NON_PROJECT);
    const ruleSetAndStandardNames = utils.scanResultHelper.getRuleSetAndStandardNamesByFilter(currentFilter);

    if(inProject && outProject) {
        pathCategory = undefined;
        scanFileIds = undefined;
    } else if(inProject) {
        pathCategory = enums.SEARCH_ISSUE_TYPE.MAP[enums.SEARCH_ISSUE_TYPE.ONLY_PROJECT];
        scanFileIds = undefined;
    } else if(outProject) {
        pathCategory = enums.SEARCH_ISSUE_TYPE.MAP[enums.SEARCH_ISSUE_TYPE.ONLY_NON_PROJECT];
    }
    if(scanFileIds && scanFileIds.length === 0) {
        scanFileIds = undefined;
    }

    const payload = {
        scanTaskId: scanTaskId,
        searchValue: currentFilter.searchValue || undefined,
        ruleSets: [currentFilter.ruleSetId],
        scanFileIds: scanFileIds,
        pathCategory: pathCategory,
        certainty: currentFilter.includePossibleDefect ? undefined : enums.ISSUE_CERTAINTY.D,
        ruleSetAndStandardNames: ruleSetAndStandardNames || undefined,
        validationAction: (!validationFilterType || validationFilterType === enums.VALIDATION_FILTER_TYPE.ALL) 
                ? undefined 
                : validationFilterType
    };

    payload.ruleSets = isMisraPage ? enums.MISRA_RULE_SETS : enums.BUILTIN_RULE_SETS;
    if(currentFilter.ruleSetId) {
        payload.ruleSets = [currentFilter.ruleSetId];
    }

    payload.dsrType = isDsrPage 
            ? [enums.DSR_TYPE.NEW, enums.DSR_TYPE.FIXED, ...enums.DSR_TYPE.OUTSTANDING_ALL] 
            : [enums.DSR_TYPE.NEW, ...enums.DSR_TYPE.OUTSTANDING_ALL];

    pageNumber && (payload.page = pageNumber);
    pageSize && (payload.size = pageSize);

    payload['ruleCodes'] = utils.scanResultHelper.remapRuleCodePayload(currentFilter.ruleCodes);

    //when rule code exists, no rule set filter
    if(payload.ruleCodes && payload.ruleCodes.length) {
        delete payload['ruleSets'];
    }

    return payload;
}

export const searchIssueGroup = (payload = {
    page: 0,
    size: 10,
    scanTaskId: undefined,
    projectId: undefined,
    ruleSets: undefined,
    ruleCodes: undefined,
    scanFileIds: undefined,
    pathCategory: undefined,
    dsrType: undefined,
    certainty: undefined,
    searchValue: '',
    sort: ''
}) => async (dispatch, getState, api) => {
    return api.issue.searchIssueGroup(payload);
}

export const assignIssueToUser = (issueGroupId, userId) => async (dispatch, getState, api) => {
    return api.issue.assignIssueUser(issueGroupId, userId);
}
export const fetchIssueListByGroupId = (scanTaskId, issueGroup, msg_templ) => async (dispatch, getState, api) => {
    const pathMsgs = getState()['rule']['pathMsg'];

    let msgObj = null;
    let issueList = [];
    let currPageNum = 1;
    let response = null;

    while(!response || currPageNum <= response.totalPages) {
        response = await api.issue.getIssueListByGroupId(scanTaskId, issueGroup.id, currPageNum);
        if(response.error) break;
        currPageNum++;
        issueList = issueList.concat(response.content);
    }

    if(response.error) return response;

    issueList.length && issueList.forEach(issue => {
        issue.tracePath = issue.tracePath || [];

        if(issueGroup.srcRelativePath) {
            issue.tracePath.unshift({
                columnNo: issueGroup.srcColumnNo,
                file: issueGroup.srcRelativePath,
                lineNo: issueGroup.srcLineNo,
                msgId: issueGroup.srcMessageId
            });
        }

        if(issueGroup.sinkRelativePath) {
            issue.tracePath.push({
                columnNo: issueGroup.sinkColumnNo,
                file: issueGroup.sinkRelativePath,
                lineNo: issueGroup.sinkLineNo,
                msgId: issueGroup.sinkMessageId
            });
        }

        issue.tracePath.forEach((node, index) => {
            msgObj = pathMsgs.find(x => x.id === node.msgId);
            node.seq = index + 1;
            node.message = (msgObj && msgObj['msg']) || '';
        });

        issue.description = getTracePathDescription(issueGroup.functionName, issueGroup.variableName, issue, msg_templ);
    });
    dispatch({
        type: 'SET_ISSUE_LIST',
        payload: issueList || [],
    });
    return issueList || [];
}

export const fetchIssueGroupById = (scanTaskId, issueGroupId) => async (dispatch, getState, api) => {
    const issueGroup = await api.issue.getIssueGroupById(scanTaskId, issueGroupId);
    dispatch({
        type: 'SET_ISSUE_GROUP',
        payload: issueGroup,
    });
    return issueGroup;
}

export const fetchSearchSuggest = ({filter, page, size}) => async (dispatch, getState, api) => {
    return api.issue.getSearchSuggest(filter, page, size);
}

export const searchIssueValidationList = (filter) => async (dispatch, getState, api) => {
    return api.issue.searchIssueValidationList(filter);
}

export const addIssueValidation = (data) => async (dispatch, getState, api) => {
    return api.issue.addIssueValidation(data);
}

export const updateIssueValidation = (data) => async (dispatch, getState, api) => {
    return api.issue.updateIssueValidation(data);
}

export const deleteIssueValidation = (id) => async (dispatch, getState, api) => {
    return api.issue.deleteIssueValidation(id);
}