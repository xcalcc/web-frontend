import * as utils from 'Utils';

const initialState = {
    userInfo: {
        name: '',
        email: '',
        groups: '',
        isAdmin: utils.localStore && utils.localStore.get("isAdmin"),
        displayName: '',
    },
    userConfig: {},
    userList: [],
    assigneeList: []
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USER_INFO':
            return {
                ...state,
                ...{
                    userInfo: action.payload
                },
            };
        case 'SET_USER_LIST':
            return {
                ...state,
                ...{
                    userList: action.payload
                },
            };
        case 'SET_ASSIGNEE_LIST':
            return {
                ...state,
                ...{
                    assigneeList: action.payload
                },
            };
        case 'SET_USER_CONFIG':
            return {
                ...state,
                ...{
                    userConfig: action.payload
                },
            };
        default:
            return state;
    }
};

export default userReducer;
