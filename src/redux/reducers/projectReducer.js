const initialState = {
    projectData: {},
    projectList: [],
};

const projectReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_PROJECT_DATA':
            return {
                ...state,
                ...{
                    projectData: action.payload
                },
            };
        case 'SET_PROJECT_LIST':
            return {
                ...state,
                ...{
                    projectList: action.payload
                },
            };
        default:
            return state;

    }
};

export default projectReducer;
