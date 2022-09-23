const initialState = {
    ruleSetList: [],
    ruleList: [],
    pathMsg: [],
    csvCodeRuleListIndexMap: {},
    standardMap: {},
    currentRuleSetIndex: 0,
    ruleCodeNameMap: {},
    customRuleList: [],
};

const ruleReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_RULE_SET_LIST':
            return {
                ...state,
                ruleSetList: action.payload,
            };
        case 'SET_CURRENT_RULE_SET':
            return {
                ...state,
                currentRuleSetIndex: action.payload,
            };
        case 'SET_RULE_CODE_MAP':
            return {
                ...state,
                ruleCodeNameMap: action.payload,
            };
        case 'SET_RULE_LIST':
            return {
                ...state,
                ruleList: action.payload,
            };
        case 'SET_PATH_MSG':
            return {
                ...state,
                pathMsg: action.payload,
            };
        case 'SET_RULE_LIST_BY_CSV_CODE':
            return {
                ...state,
                csvCodeRuleListIndexMap: action.payload,
            };
        case 'SET_STANDARD_MAP':
            return {
                ...state,
                standardMap: action.payload,
            };
        case 'SET_CUSTOM_RULE_LIST':
            return {
                ...state,
                customRuleList: action.payload,
            };
        default:
            return state;

    }
};

export default ruleReducer;
