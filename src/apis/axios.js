import axios from "axios";
import i18n from 'i18next';
import * as utils from "Utils";
import enums from "Enums";
import * as actions from 'Actions';
import store from 'Store';

// axios.defaults.timeout = 30 * 1000; //maximum 30 sec timeout
axios.interceptors.request.use(config => {
  const accessToken = utils.localStore.get("accessToken") || "";
  const tokenType = utils.localStore.get("tokenType") || "";
  const correlationId = utils.traceId();
  config.headers["Authorization"] = `${tokenType} ${accessToken}`;
  config.headers["X-B3-TraceId"] = correlationId;
  config.headers["X-B3-SpanId"] = correlationId;

  if(!config.headers["Content-Type"]){
    config.headers["Content-Type"] = "application/json";
  }

  let language = localStorage.getItem("language") || "en";
  let params = config.params || {};
  params["locale"] = language;
  config.params = params;

  config.metadata = {};
  config.metadata.startTime = new Date().getTime();

  return config;
}, error => {
  return Promise.reject(error);
});

axios.interceptors.response.use(response => {
  try{
    response.config.metadata.endTime = new Date().getTime();
    const duration = (response.config.metadata.endTime - response.config.metadata.startTime) / 1000;
    const styleColor = duration > enums.API_RESPONSE_WARN_TIME ? 'red' : 'green';
    console.log(`%c █████ ${duration}(sec) ${response.config.url}`, `color: ${styleColor};`);
  } catch(e) {}
  return response;
}, error => {

  const expectedError = 
    error.response && 
    error.response.status >= 400 && 
    error.response.status < 500;

  if(expectedError) {
    const isLoginPage = error.response.config.url === "/api/auth_service/v2/login";

    if(isLoginPage){
      if(error.response.status === 401){
        error.response.status = 400;
        error.response.data.responseCode = 400;
      }
    }
  
    if(error.response.status === 401){
      utils.localStore.remove("tokenType");
      utils.localStore.remove("accessToken");

      store.dispatch(actions.pushAlert({
        title: i18n.t('error.error'),
        content: utils.getApiMessage(error),
        type: 'error',
        callbackFn: () => {
          if (utils.getAppFrom() !== enums.APP_FROM.ANT) {
            window.location = "/login"
          }
        }
      }));
    }

    if(error.response.status === 403){
      window.location = "/error";
    }
  }

  return Promise.reject(error);
});

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete
};
