import axios from "axios";
import * as utils from "Utils";

axios.interceptors.request.use(config => {
  const accessToken = utils.localStore.get("accessToken") || "";
  const tokenType = utils.localStore.get("tokenType") || "";

  config.headers["Authorization"] = `${tokenType} ${accessToken}`;

  if(!config.headers["Content-Type"]){
    config.headers["Content-Type"] = "application/json";
  }

  let language = localStorage.getItem("language") || "en";
  let params = config.params || {};
  params["locale"] = language;
  config.params = params;

  if(config.paramsSerializer){
    let p = config.url.indexOf("?") > -1 ? "&" : "?";
    config.url = config.url + p + "locale=" + language;
  }

  return config;
}, error => {
  return Promise.reject(error);
});

axios.interceptors.response.use(response => {
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
