const initialState = {
    projectList: null,
    scanSummaries: [],
    currentScanSummary: null,
    previousScanSummary: null,
    scanProgress: {
        "asdsaasd-asadsasd": {
            currentStatus: '',
            percentage: 40,
        },
    },
};

const scanReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_PROJECT_LIST':
            return {
                ...state,
                ...{
                    projectList: action.payload
                },
            };
        case 'SET_SCAN_SUMMARIES':
            return {
                ...state,
                ...{
                    scanSummaries: action.payload
                },
            };
        case 'SET_CURRENT_SUMMARY':
            return {
                ...state,
                ...{
                    currentScanSummary: action.payload
                },
            };
        case 'SET_PREVIOUS_SUMMARY':
            return {
                ...state,
                ...{
                    previousScanSummary: action.payload
                },
            };
        default:
            return state;

    }
};

export default scanReducer;
