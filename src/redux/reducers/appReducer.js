import i18n from "i18next";

const initialState = {
    appInfo: null,
    urlHistoryList: [],
    languageOptions: [
        {
            label: i18n.t("all"),
            value: "all"
        },
        {
            label: "C/C++",
            value: ["C", "C++"]
        },
        {
            label: "JAVA",
            value: ["JAVA"]
        }
    ],
    alerts: [],
    notifications:[],
    locale: localStorage.getItem('language') || 'en',
};

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ALTER_ALERT':
            return {
                ...state,
                ...{
                    alerts: action.payload
                },
            };
        case 'SET_NOTIFICATION':
            return {
                ...state,
                ...{
                    notifications: action.payload
                },
            };
        case 'SET_APP_INFO':
            return {
                ...state,
                ...{
                    appInfo: action.payload
                },
            };
        case 'SET_LOCALE':
            return {
                ...state,
                ...{
                    locale: action.payload
                },
            };
        case 'SET_URL_HISTORY':
            return {
                ...state,
                ...{
                    urlHistoryList: action.payload
                },
            };
        default:
            return state;
    }
};

export default appReducer;
