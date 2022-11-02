import i18n from "i18next";
import {v4 as uuidv4} from 'uuid';
export {default as issueTraceHelper} from './issueTraceHelper';
export {default as scanResultHelper} from './scanResultHelper';
export {default as sort} from './common/sort';
export {default as validation} from './common/validation';
export {default as validationWithProject} from './validationWithProject';

window.XCAL = window.XCAL || {};

/*
 * Get the current language
 */
export const isEnglish = () => localStorage.getItem("language") === "en";
export const isChinese = () => !isEnglish();

export const getRandom = () => {
    let timespan = (+new Date()).toString();
    return timespan.substring(4) + Math.floor(Math.random() * 10000).toString();
}

/*
 * Get the system type
 */
export const isWindows = () => navigator.platform.indexOf('Win') > -1;

/*
 * Validate data type
 */
export const isNumber = (str) => /^\d+(\.\d+)?$/.test(str);

export const isEmail = (str) => /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(str);

export const isString = (obj) => Object.prototype.toString.call(obj) === "[object String]";

export const isDate = (obj) => Object.prototype.toString.call(obj) === "[object Date]";

export const isJson = (obj) => Object.prototype.toString.call(obj) === "[object Object]";

export const isFunction = (obj) => Object.prototype.toString.call(obj) === "[object Function]";

export const isEmpty = (str) => {
    return str === "" || str === null || str === undefined;
}

export const isJsonString = (str) => {
    if (isEmpty(str)) return false;
    if (!isString(str)) return false;
    try {
        return isJson(JSON.parse(str));
    } catch (err) {
        return false;
    }
}

export const isSingleJsonString = (str) => {
    if (!isString(str)) return false;
    try {
        let existsObject = false;
        let obj = JSON.parse(str);

        if (Array.isArray(obj)) return false;

        for (let key in obj) {
            if (!isString(obj[key]) && !isNumber(obj[key])) {
                existsObject = true;
                break;
            }
        }
        return existsObject ? false : true;
    } catch (err) {
        return false;
    }
}

export const isEmptyObject = (obj) => {
    for (let key in obj) {
        return false;
    }
    return true;
}

/*
 * Remove before and after Spaces
 */
export function trim(str) {
    if (isEmpty(str)) return str;
    if (!isString(str)) return str;
    if (String.prototype.trim) return str.trim();
    return str.replace(/^\s+|\s+$/gm, '');
}

/*
 * Add a comma to the thousandth place
 */
export function formatNumber(n) {
    if (!isNumber(n)) return n;
    return Number(n).toLocaleString("en-US");
}

/**
 *
 * @param n percentage (with 100 multiplied)
 * @returns {string|*}
 */
export function formatPercentage(n) {
    if (!isNumber(n)){
        return {
            num: n,
            string: n,
        };
    }
    if(!n) {
        return {
            num: 0,
            string: `0%`
        };
    }
    if (n >= 1) {
        const num = Math.round(n);
        return {
            num,
            string: `${num}%`
        };
    }
    if (n < 1) {
        const num = Math.round(n);
        return {
            num,
            string: '<1%'
        };
    }
}

/*
 * Truncate string
 */
export function strLimit(str, len, hasDot = true) {
    if (!isString(str)) return str;
    if (!isNumber(len)) return str;

    var newStr = "";
    var newLength = 0;
    var singleChar = "";
    var regex = /[^\x20-\xff]/g;
    var strLength = str.replace(regex, "**").length;
    if (strLength <= len) return str;

    for (var i = 0; i < strLength; i++) {
        singleChar = str.charAt(i);
        if (singleChar.match(regex) === null) {
            newLength++;
        } else {
            newLength += 2;
        }
        if (newLength > len) {
            break;
        }
        newStr += singleChar;
    }

    if (hasDot && strLength > len) {
        newStr += "...";
    }
    return newStr;
}

/*
 * Convert string to date
 */
export function parseDate(s) {
    if (!s) {
        throw new Error("Value cannot be null of 'parseDate()'!");
    }

    if (/^\d{10}$/.test(s)) {
        return new Date(s * 1000);
    } else if (/^\d{13}$/.test(s)) {
        return new Date(s * 1);
    }

    if (/\dT\d/.test(s) && s.indexOf('+0000') > -1) {
        //Is only used to Xcalibyte (ex. 2019-08-14T06:21:09.842+0000)
        let a = s.match(/\d+/g);
        return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
    }

    return new Date(s.toString().replace(/-/g, "/"));
}

/*
 * Set DEV mode, used to test hidden new features
 */
const DEV_MODE_OPTION_CACHE_ID = "dev_mode_option";

export const setDevMode = () => {
    var query = queryString();
    if (query.dev === "1") {
        window.location.href = "/dev-setting"
    }
    if (query.dev === "0") {
        sessionStorage.removeItem(DEV_MODE_OPTION_CACHE_ID);
    }
}

export const isEnableDevMode = () => {
    const data = getDevModeOption();
    return !isEmptyObject(data);
}

export const isEnableDevModeOption = (option) => {
    if (isEmpty(option)) return false;

    let data = getDevModeOption();
    if (isEmpty(data)) return false;
    return data[option] === 1;
}

export const getDevModeOption = () => {
    const dataString = sessionStorage.getItem(DEV_MODE_OPTION_CACHE_ID);
    if (isEmpty(dataString)) return null;
    if (!isJsonString(dataString)) return null;
    return JSON.parse(dataString);
}

export const setDevModeOption = (data) => {
    if (isEmpty(data)) return;
    sessionStorage.setItem(DEV_MODE_OPTION_CACHE_ID, JSON.stringify(data));
}

/*
 * Url redirect
 */
export const urlRedirect = {
    autoSet: function () {
        let pathname = window.location.pathname;
        let search = window.location.search;
        let redirect = pathname + search;
        sessionStorage.setItem("redirect_url", redirect);
    },
    get: function () {
        let redirect = sessionStorage.getItem("redirect_url");
        sessionStorage.removeItem("redirect_url");
        return redirect;
    },
    clear: function () {
        sessionStorage.removeItem("redirect_url");
    }
}

/*
 * String Fuzzy compare
 */
export function isStringFuzzyEqual(str1, str2) {
    const s1 = str1 || '';
    const s2 = str2 || '';
    return s1.toLowerCase() === s2.toLowerCase();
}

/*
 * Deep compare
 */
export function isDeepEqual(param1, param2) {
    if (param1 === undefined && param2 === undefined) return true;
    else if (param1 === undefined || param2 === undefined) return false;
    else if (param1.constructor !== param2.constructor) return false;

    if (param1.constructor === Array) {
        if (param1.length !== param2.length) return false;
        for (let i = 0; i < param1.length; i++) {
            if (param1[i].constructor === Array || param1[i].constructor === Object) {
                if (!isDeepEqual(param1[i], param2[i])) return false;
            } else if (param1[i] !== param2[i]) return false;
        }
    } else if (param1.constructor === Object) {
        if (Object.keys(param1).length !== Object.keys(param2).length) return false;
        for (let i = 0; i < Object.keys(param1).length; i++) {
            const key = Object.keys(param1)[i];
            if (
                param1[key] &&
                typeof param1[key] !== 'number' &&
                (param1[key].constructor === Array ||
                    param1[key].constructor === Object)
            ) {
                if (!isDeepEqual(param1[key], param2[key])) return false;
            } else if (param1[key] !== param2[key]) return false;
        }
    } else if (param1.constructor === String || param1.constructor === Number) {
        return param1 === param2;
    }
    return true;
}


/*
 * Date format
 * dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss.S") ==> 2001-07-02 08:09:04.423
 * dateFormat(new Date(), "yyyy-M-d h:m:s.S")      ==> 2001-7-2 8:9:4.18
 */
export function dateFormat(dt, fmt) {
    if (!isDate(dt)) {
        throw new Error("Invalid date of 'dateFormat()'!");
    }

    var o = {
        "M+": dt.getMonth() + 1,
        "d+": dt.getDate(),
        "h+": dt.getHours(),
        "m+": dt.getMinutes(),
        "s+": dt.getSeconds(),
        "q+": Math.floor((dt.getMonth() + 3) / 3),
        "S": dt.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (dt.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};

export function dateFormatToEnglish(dt, fmt) {
    let o = {
        "h+": dt.getHours(),
        "m+": dt.getMinutes(),
        "s+": dt.getSeconds(),
        "q+": Math.floor((dt.getMonth() + 3) / 3),
        "S": dt.getMilliseconds()
    };
    let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    let strDate = "", strTime = "";
    if (/d+/.test(fmt)) {
        strDate = dt.getDate();
    }
    if (/M+/.test(fmt)) {
        strDate = (strDate ? (strDate + " ") : "") + month[dt.getMonth()];
    }
    if (/y+/.test(fmt)) {
        strDate = (strDate ? (strDate + ", ") : "") + dt.getFullYear();
    }

    strTime = fmt.replace(/[yMd\-\.\/]+/g, "").trim();

    for (let k in o) {
        if (new RegExp("(" + k + ")").test(strTime)) {
            strTime = strTime.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return strDate + " " + strTime;
}

export function secondToTime(second) {
    let hour = Math.floor(second / 3600);
    second = hour ? (second % 3600) : second;

    let minute = Math.floor(second / 60);
    second = minute ? (second % 60) : second;

    hour = hour < 10 ? "0" + hour : hour;
    minute = minute < 10 ? "0" + minute : minute;
    second = second < 10 ? "0" + second : second;
    return `${hour}:${minute}:${second}`;
}

export function millisecondToTime(millisecond) {
    return secondToTime(Math.floor(millisecond / 1000));
}

/*
 * A complete cookies reader/writer framework with full unicode support
 */
export const docCookies = {
    getItem: function (sKey) {
        if (!sKey) {
            return null;
        }
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
            return false;
        }
        var sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
                default:
                    break;
            }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return true;
    },
    removeItem: function (sKey, sPath, sDomain) {
        if (!this.hasItem(sKey)) {
            return false;
        }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true;
    },
    hasItem: function (sKey) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
            return false;
        }
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: function () {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
            aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
        }
        return aKeys;
    }
};

/*
  Local store data
 */
export const localStore = {
    keys: {
        default: "xcal"
    },
    set: function (key, value) {
        var data = this.get();
        data[key] = value;
        this.setData(data);
    },
    get: function (key) {
        var data = {};
        var str = localStorage.getItem(this.keys.default);
        str = decode(str);

        if (isJsonString(str)) {
            data = JSON.parse(str);
        }
        return key ? data[key] : data;
    },
    remove: function (key) {
        var data = this.get();
        delete data[key];
        this.setData(data);
    },
    setData: function (data) {
        var str = encode(JSON.stringify(data));
        localStorage.setItem(this.keys.default, str);
    },
    setDataRow: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    },
    getDataRow: key => {
        let result = localStorage.getItem(key);
        try {
            result = JSON.parse(localStorage.getItem(key));
        } catch(e) {}
        return result;
    },
    clearAll() {
        localStorage.removeItem(this.keys.default);
    }
}

/*
  Session store data
 */
export const sessionStore = {
    set: function (key, value) {
        sessionStorage.setItem(key, value);
    },
    get: function (key) {
        return sessionStorage.getItem(key);
    },
    remove: function (key) {
        sessionStorage.removeItem(key);
    }
}

/*
  String encoding
 */
export function encode(str) {
    if (isEmpty(str)) return str;
    var base64 = new Base64();
    var result = base64.encode(str) || "";
    result = result.replace(/\=/g, "");
    var a = result.substring(0, 1);
    var b = result.substring(1);
    return b + a;
}

/*
  String decoding
 */
export function decode(str) {
    if (isEmpty(str)) return str;
    var a = str.substring(0, str.length - 1);
    var b = str.substring(str.length - 1);

    str = b + a;
    var n = 4 - (str.length % 4);
    str += (n === 4 ? "" : Array(n + 1).join("="));

    var base64 = new Base64();
    return base64.decode(str);
}

/**
 *
 * Base64 encode / decode
 *  var str = 'test123';
 *  var base64 = new Base64();
 *  var result = base64.encode(str);
 *  console.log(result);
 *  console.log(base64.decode(result));
 */
export function Base64() {
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    this.encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }

    this.decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 !== 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 !== 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    }

    var _utf8_encode = function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    }

    var _utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = 0;
        var c2 = 0;
        var c3 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}

/**
 * Compare two strings for string sorting.
 * 
 * - If the string contains a separator,
 *   such as 'A1_3_4', pass @separator='_'
 *   such as 'A.3.4', pass @separator='.'
 *
 * @param {string} prev - The first string
 * @param {string} next - The second string
 * @param {string} separator (optional)
 * @return {number} -1/0/1
 * 
 */
export function compareString(prev, next, separator) {
    const prevItems = prev.split(separator);
    const nextItems = next.split(separator);
    const maxLen = Math.max(prevItems.length, nextItems.length);
    let result = 0;

    for(let i=0; i<maxLen; i++) {
        const prevItem = prevItems[i] || '';
        const nextItem = nextItems[i] || '';

        if(prevItem === nextItem) {
            continue;
        }

        const prevStrPart = (prevItem.match(/[a-zA-Z]+/) && prevItem.match(/[a-zA-Z]+/)[0]) || '';
        const nextStrPart = (nextItem.match(/[a-zA-Z]+/) && nextItem.match(/[a-zA-Z]+/)[0]) || '';

        const prevNumPart = Number(prevItem.match(/\d+/) && prevItem.match(/\d+/)[0]);
        const nextNumPart = Number(nextItem.match(/\d+/) && nextItem.match(/\d+/)[0]);

        if(prevStrPart !== nextStrPart) {
            result = prevStrPart.localeCompare(nextStrPart);
            break;
        } 

        if(prevNumPart !== nextNumPart) {
            result = prevNumPart - nextNumPart > 0 ? 1 : -1;
            break;
        }
    }

    return result;
}

/*
 * Get query parameter of url
 */
export function queryString(search) {
    var url = search || window.location.search;
    var str = url;
    var theRequest = {};

    if (url.indexOf("?") !== -1) {
        str = url.substr(1);
    }

    if (str.length > 0) {
        str = str.split("&");

        for (var i = 0; i < str.length; i++) {
            theRequest[str[i].split("=")[0]] = decodeURI(str[i].split("=")[1] || "");
        }
    }

    return theRequest;
};

/*
 * Handle a null value
 */
export function formatNullValue(originalValue, defaultValue) {
    if (originalValue === null || originalValue === undefined || originalValue === "") {
        return defaultValue;
    }
    return originalValue;
}

/*
 * Function throttle
 */
export function throttle(fn, wait) {
    let timer = null;
    return function () {
        const context = this;
        const args = arguments;
        if (!timer) {
            timer = setTimeout(function() {
                fn.apply(context, args);
                timer = null;
            }, wait)
        }
    }
}

/*
 * Function debounce
 */
export function debounce(fn, wait) {
    let timer = null;
    return function () {
        const context = this;
        const args = arguments;
        if (timer !== null) {
            clearTimeout(timer);
        }
        timer = setTimeout(function() {
            fn.apply(context, args)
        }, wait);
    }
}

/*
 * Get error message for try catch
 */
export function getApiMessage(error) {
    let message;
    if (error.response) {
        let data = error.response.data || {};
        if (typeof data === "string") {
            //server error (e.g. http 500)
            message = language(error.response.statusText);
        } else {
            //api error
            message = data.localizedMessage || data.message || data.error || error.response.statusText;
            message = formattingApiMessage(message, data.unifyErrorCode)
        }
    } else {
        //js error or Network Error
        message = error.toString();
        message = message.replace(/Error:\s?/, "");
        message = language(message) || "";
    }

    return message;
}

/*
 * Formatting error message
 */
export function formattingApiMessage(message, unifyErrorCode) {
    let newMessage;
    let msgList = message.match(/(\[.+?\])/g) || [];

    if (msgList.length === 0) {
        newMessage = message;
    } else {
        msgList = msgList.map(v => language(v.replace(/\[|\]/g, "")));
        newMessage = msgList.join("<br/>");
    }

    return `${newMessage}` + (unifyErrorCode ? ` (${unifyErrorCode})` : "");
}

/*
 * Multilingual conversion
 */
export function language(msg, data) {
    if (!msg) {
        return "";
    }

    if (msg.indexOf("[") > -1) {
        let keyList = msg.match(/(\[.+?\])/g) || [];
        keyList.forEach(key => {
            let i18nTxt = i18n.t(key.replace(/\[|\]/g, ""));
            msg = msg.replace(key, i18nTxt);
        });
        return msg;
    }
    return i18n.t(msg, data) || ""
}

/*
 * Dynamic load css file
 */
export function html2Escape(sHtml) {
    return sHtml.replace(/[<>&"]/g, function(c) {
        return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];
    });
}

/*
 * Dynamic load css file
 */
export function loadCssFile(url) {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = url;
    head.appendChild(link);
}

export function removeCssFile(elementId) {
    var csslink = document.getElementsById(elementId);
    csslink.parentNode.removeChild(csslink);
}

/*
 * Get image of theme
 */
export function getThemeImg(imgFileName) {
    return "/images/red/" + imgFileName;
}

export function traceId() {
    return uuidv4().replace(/-/g, '').slice(0, 16);
}

export function normalizeRuleCsvCode(csvCode) {
    return csvCode.replace(/\d+$/g, '0');
}

/*
 * Whether the specified className exists in the Event object
 */
export const isExistClassNameInEvent = (domEvent, className) => {
    let isExist = false;
    let elem = domEvent.srcElement;
    while (elem && elem.nodeType !== 9) {
        if (String(elem.className).includes(className)) {
            isExist = true;
            break;
        }
        elem = elem.parentNode;
    }

    return isExist;
};

/*
 * Gets all parent elements
 */
export const getParentElements = (dom, until) => {
    let matched = [];
    let cur = dom.parentNode;

    until = until || 'html';

    while (cur && cur.nodeType !== 9 && cur !== document.querySelector(until)) {
        if (cur.nodeType === 1) {
            matched.push(cur);
        }
        cur = cur.parentNode;
    }
    return matched;
}

/*
 * APP From refers to the URL parameter 'from'.
 */
export const setAppFrom = () => {
    const query = queryString();
    if (query.from) {
        sessionStorage.setItem('appFrom', query.from);
    }
}

export const getAppFrom = () => sessionStorage.getItem('appFrom');