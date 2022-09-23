import i18n from "i18next";

import errorZh from './zh/_error.yml';
import errorEn from './en/_error.yml';
import commonZh from './zh/_common.yml';
import commonEn from './en/_common.yml';
import userZh from './zh/_user.yml';
import userEn from './en/_user.yml';
import projectEn from './en/_project.yml';
import projectZh from './zh/_project.yml';
import dashboardEn from './en/_dashboard.yml';
import dashboardZh from './zh/_dashboard.yml';
import issueDetailEn from "./en/_issueDetail.yml";
import issueDetailZh from "./zh/_issueDetail.yml";
import misraEn from './en/_misra.yml';
import misraZh from './zh/_misra.yml';
import pagesEn from './en/_pages.yml';
import pagesZh from './zh/_pages.yml';

import uiLanguage from "./language-ui.json";
import apiLanguage from "./language-api.json";

let lng = null;
let enData = {};
let zhCNData = {};

lng = localStorage.getItem("language") || "zh-CN";

for(let key in uiLanguage){
  enData[key] = uiLanguage[key]["en"];
  zhCNData[key] = uiLanguage[key]["zh-CN"];
}

for(let key in apiLanguage){
  enData[key] = apiLanguage[key]["en"];
  zhCNData[key] = apiLanguage[key]["zh-CN"];
}
const resources = {
  "en": {
    translation: {
        ...enData,
        ...userEn,
        ...commonEn,
        ...errorEn,
        ...pagesEn,
        ...projectEn,
        ...dashboardEn,
        ...misraEn,
        ...issueDetailEn,
    }
  },
  "zh-CN": {
      translation: {
          ...zhCNData,
          ...userZh,
          ...commonZh,
          ...errorZh,
          ...pagesZh,
          ...projectZh,
          ...dashboardZh,
          ...misraZh,
          ...issueDetailZh,
      }
  }
};

i18n
  .init({
    resources,
    lng: lng,
    fallbackLng: 'zh-CN',
    keySeparator: '.',
    nsSeparator: false,
    interpolation: {
      escapeValue: false
    }
  }).catch(e => console.log(e));

export default i18n;