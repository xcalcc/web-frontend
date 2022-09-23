import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer from "Redux/reducers";
import api from 'APIs';

const store = createStore(
    rootReducer,
    applyMiddleware(
        thunk.withExtraArgument(api),
        logger
    )
);
export default store;

