import { combineReducers } from 'redux';
import scanReducer from 'Redux/reducers/scanReducer';
import userReducer from 'Redux/reducers/userReducer';
import appReducer from 'Redux/reducers/appReducer';
import ruleReducer from 'Redux/reducers/ruleReducer';
import projectReducer from 'Redux/reducers/projectReducer';
import fileReducer from 'Redux/reducers/fileReducer';
import cacheReducer from 'Redux/reducers/cacheReducer';
import issueReducer from 'Redux/reducers/issueReducer';
import pageReducer from 'Redux/reducers/pageReducer';

const rootReducer = combineReducers({
    scan: scanReducer,
    user: userReducer,
    app: appReducer,
    rule: ruleReducer,
    project: projectReducer,
    file: fileReducer,
    cache: cacheReducer,
    issues: issueReducer,
    page: pageReducer,
});

export default rootReducer;
