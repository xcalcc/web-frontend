import Enums from 'Enums';

export const getRuleInfoByCsvCode = csvCode => (dispatch, getState) => {
    const ruleState = getState()['rule'];
    const ruleList = ruleState.ruleList || [];
    const csvCodeRuleListIndexMap = ruleState.csvCodeRuleListIndexMap;
    const customRuleList = ruleState.customRuleList;

    let ruleInfo = ruleList[csvCodeRuleListIndexMap[csvCode]] || ruleList.find(rule => rule.code === csvCode);

    if(!ruleInfo) {
        const customRule = customRuleList.find(rule => rule.code === csvCode);

        if(customRule) {
            ruleInfo = {
                _isCustomRule: true,
                ...customRule,
            }
        } else {
            ruleInfo = {};
        }
    }

    return ruleInfo;
}

export const fetchRuleSetList = () => async (dispatch, getState, api) => {
    const callback = await api.rule.getRuleSets();
    let ruleSets = callback.data || [];
    ruleSets = ruleSets.map(ruleset => ({
        ...ruleset,
        value: ruleset.code,
        label: ruleset.displayName,
        type: 'ruleset'
    }));
    ruleSets.unshift({
        id: 'all',
        value: Enums.RULE_SET.ALL,
        label: Enums.RULE_SET.ALL,
        displayName: Enums.RULE_SET.ALL,
        type: 'all'
    });
    // Enums.RULE_STANDARDS.forEach(standard => {
    //     ruleSets.push({
    //         id: standard,
    //         value: standard,
    //         label: standard.toUpperCase(),
    //         displayName: standard.toUpperCase(),
    //         type: 'standard'
    //     });
    // });
    dispatch({
        type: 'SET_RULE_SET_LIST',
        payload: ruleSets
    });

    return callback.data || [];
};

//deprecated soon after new scan result page rolls out
export const fetchRuleListByRuleSetName = (ruleSetId = null) => async (dispatch, getState, api) => {
    let ruleList = [];
    if(!ruleSetId) {
        ruleList = await api.rule.getRuleSets();
    } else {
        ruleList = await api.rule.getRuleInformationList(ruleSetId);
    }
    dispatch({
        type: 'SET_RULE_LIST',
        payload: ruleList
    });
    return ruleList;
};

export const fetchRuleList = () => async (dispatch, getState, api) => {
    let callback = await api.rule.getRuleInformationList();
    if(callback.rules) {
        try {
            const rules = callback.rules;
            dispatch({
                type: 'SET_RULE_LIST',
                payload: rules
            });

            dispatch({
                type: 'SET_RULE_LIST_BY_CSV_CODE',
                payload: callback.csvCodeMap
            });
            return callback;

        } catch (e) {
            console.error(e);
        }
    }
    return {};
};
export const fetchStandardInfo = standard => async (dispatch, getState, api) => {
    let standardMapCallback = await api.rule.getStandardMap(standard);
    const standardData = getState()['rule']['standardMap'];
    const newStandardMap = {
        ...standardData,
        [standard]: standardMapCallback.data
    };
    dispatch({
        type: 'SET_STANDARD_MAP',
        payload: newStandardMap
    });
    return standardMapCallback.data;
};
export const fetchStandards = () => async (dispatch, getState, api) => {
    const standardsCallback = await api.rule.getStandards();
    const newStandardMap = standardsCallback.data;
    dispatch({
        type: 'SET_STANDARD_MAP',
        payload: newStandardMap
    });
    return standardsCallback.data;
};

export const setCurrentRuleSet = rulesetIndex => async dispatch => {

    dispatch({
        type: 'SET_CURRENT_RULE_SET',
        payload: rulesetIndex
    });
    return rulesetIndex;
};
export const fetchRuleCodeMap = () => async (dispatch, getState, api) => {
    const ruleCodeNameMap = await api.rule.fetchRuleCodeNameMap();
    if(ruleCodeNameMap) {
        dispatch({
            type: 'SET_RULE_CODE_MAP',
            payload: ruleCodeNameMap
        });
    }
};
export const fetchPathMsg = () => async (dispatch, getState, api) => {
    const pathMsgResponse = await api.rule.fetchPathMsg();
    if(pathMsgResponse.data) {
        dispatch({
            type: 'SET_PATH_MSG',
            payload: pathMsgResponse.data
        });
    }
};
export const fetchCustomRuleMap = projectKey => async (dispatch, getState, api) => {
    let ruleList = [];
    const pathMsgs = getState()['rule']['pathMsg'];
    const response = await api.rule.getCustomRuleMap(projectKey) || {};
    if(response.rules) {
        const customRules = response.rules.customRules || {};
        const customPathMsg = (customRules.pathMsg && customRules.pathMsg.msg) || [];
        ruleList = customRules.rules || [];
        dispatch({
            type: 'SET_CUSTOM_RULE_LIST',
            payload: ruleList
        });
        dispatch({
            type: 'SET_PATH_MSG',
            payload: pathMsgs.concat(customPathMsg)
        });
    }
    return ruleList;
};
