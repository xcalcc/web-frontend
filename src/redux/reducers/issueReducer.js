const initialState = {
    issueGroup: {},
    issueList: [],
};

const issueReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_ISSUE_GROUP':
            return {
                ...state,
                issueGroup: action.payload,
            };
        case 'SET_ISSUE_LIST':
            return {
                ...state,
                issueList: action.payload,
            };
        default:
            return state;
    }
};

export default issueReducer;
