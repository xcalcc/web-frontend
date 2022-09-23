const initialState = {
    fileStorageList: [],
};

const fileReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_FILE_STORAGE_LIST':
            return {
                ...state,
                ...{
                    fileStorageList: action.payload
                },
            };
        default:
            return state;

    }
};

export default fileReducer;
