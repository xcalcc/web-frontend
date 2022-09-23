
const initialState = {

};

const cacheReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CACHE':
            return {
                ...state,
                ...action.payload,
            };
        case 'CLEAR_CACHE':
            return {
            };
        default:
            return state;
    }
};

export default cacheReducer;
