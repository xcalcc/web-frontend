import * as utils from "Utils";
import i18n from 'i18next';

export default {
    SCAN_RESULT_CACHE_ID: "scan_result.cacheData",
    ISSUE_DETAIL_CACHE_ID: "issue_detail.cacheData",
    GUIDE_CACHE_ID: "guide.cacheData",
    DASHBOARD_CACHE_ID: "dashboard.cacheData",

    APP_FROM: {
        ANT: 'ant'
    },

    API_RESPONSE_WARN_TIME: 0.2, //seconds
    ISSUE_SEARCH_KEYWORD_HISTORY_COUNT_LIMIT: 30,
    TRACE_PATH_MAX_NUMBER_OF_DISPLAY: 100,
    CODE_DISPLAY_LINE_OPTIONS: [
        3000,
        5000,
        10000,
        null //unlimited
    ],
    DATA_RETENTION_OPTIONS: [
        {
            label: '1',
            suffix: 'week',
            value: 7,
        },
        {
            label: '2',
            suffix: 'weeks',
            value: 14,
        },
        {
            label: '1',
            suffix: 'month',
            value: 30,
        },
        {
            label: '3',
            suffix: 'months',
            value: 90,
        },
        {
            label: '',
            suffix: 'perpetual',
            value: 9999,
        }
    ],

    MEMORY_LIMIT_C: 2, //GB
    MEMORY_LIMIT_JAVA: 4, //GB
    MEMORY_INCREASE_C: "10MB",
    MEMORY_INCREASE_JAVA: "30MB",

    DEV_MODE_OPTION: {
        viewScanHistoryRecord: "view_scan_history_record",
        userUnlock: "user_unlock",
        validation: "validation_full"
    },

    RULE_SET: {
        ALL: 'all',
        XCALIBYTE: 'X',
        CERT: 'S',
        MISRA: 'M',
        AUTOSAR: 'A'
    },

    BUILTIN_RULE_SETS: ['X', 'S'],
    MISRA_RULE_SETS: ['M', 'A'],

    RULE_SET_ID_STANDARD_MAP: {
        X: {
            displayName: 'XCALIBYTE'
        },
        S: {
            displayName: 'CERT'
        },
        M: {
            displayName: 'MISRA'
        },
        owasp: {
            displayName: 'OWASP'
        },
        cwe: {
            displayName: 'CWE'
        },
        'p3c-sec': {
            displayName: 'P3C-SEC'
        },
        'autosar': {
            displayName: 'AUTOSAR'
        },
    },

    ISSUE_SEVERITY: {
        high: "HIGH",
        medium: "MEDIUM",
        low: "LOW"
    },

    ISSUE_CRITICALITY: {
        high: "HIGH",
        medium: "MEDIUM",
        low: "LOW"
    },

    ISSUE_PRIORITY: {
        high: "HIGH",
        medium: "MEDIUM",
        low: "LOW"
    },

    ISSUE_CERTAINTY: {
        D: "D",
        M: "M"
    },

    LIKELIHOOD: {
        likely: "LIKELY",
        unlikely: "UNLIKELY",
        probable: "PROBABLE"
    },

    REMEDIATION_COST: {
        high: "HIGH",
        medium: "MEDIUM",
        low: "LOW"
    },

    ISSUE_ACTION: {
        pending: "PENDING",
        confirmed: "CONFIRMED",
        false_positive: "FALSE_POSITIVE",
        waived: "WAIVED",
        critical: "CRITICAL"
    },

    SCAN_TASK_STATUS: {
        pending: "PENDING",
        processing: "PROCESSING",
        completed: "COMPLETED",
        failed: "FAILED",
        terminated: "TERMINATED"
    },
    NOTIFICATION_TASK: {
        PREPROC: "PREPROC",
        PROC: "PROC",
        POSTPROC: "POSTPROC"
    },
    NOTIFICATION_TASK_STATUS: {
        SUCCESS: 'SUCC',
        FAILED: 'FAILED',
        FATAL: 'FATAL',
        CANCEL: 'CANCEL',
    },

    ORDER_BY: {
        ASC: "asc",
        DESC: "desc"
    },

    TABLE_VIEW_TYPE: {
        LIST: "list",
        BLOCK: "block"
    },

    TABLE_PAGINATION_OPTIONS: [
        10,
        15,
        20,
        25
    ],

    ISSUE_ACTION_LIST: [
        {
            value: "PENDING",
            name: utils.language("pending"),
            show: true
        },
        {
            value: "CRITICAL",
            name: utils.language("critical"),
            show: true
        },
        {
            value: "CONFIRMED",
            name: utils.language("confirm"),
            show: true
        },
        {
            value: "FALSE_POSITIVE",
            name: utils.language("false_positive"),
            show: true
        },
        {
            value: "WAIVED",
            name: utils.language("waived"),
            show: true
        }
    ],

    CONFIDENCE: {
        high: "CONFIDENCE_1",
        medium: "CONFIDENCE_2",
        low: "CONFIDENCE_3"
    },

    OWASP_ATTRIBUTE_VALUE: {
        high: "3",
        medium: "2",
        low: "1"
    },

    EXPLOITABILITY: {
        high: "3",
        medium: "2",
        low: "1"
    },

    PREVALENCE: {
        high: "3",
        medium: "2",
        low: "1"
    },

    DETECTABILITY: {
        high: "3",
        medium: "2",
        low: "1"
    },

    TECHNICAL: {
        high: "3",
        medium: "2",
        low: "1"
    },

    RULE_INFORMATION_ATTRIBUTE_TYPE: {
        STANDARD: "STANDARD",
        BASIC: "BASIC"
    },

    SEARCH_ISSUE_TYPE: {
        ONLY_PROJECT: "ONLY_PROJECT",
        ONLY_NON_PROJECT: "ONLY_NON_PROJECT",
        PROJECT_AND_NON_PROJECT: "PROJECT_AND_NON_PROJECT",
        MAP: {
            ONLY_PROJECT: 'H',
            ONLY_NON_PROJECT: 'T',
        }
    },

    PROJECT_ATTRIBUTE_TYPE: {
        scan: "SCAN",
        project: "PROJECT"
    },

    API_ERROR_CODE: {
        SOURCE_CODE_NOT_UPLOAD: "SOURCE_CODE_NOT_UPLOAD"
    },

    FILE_STORAGE_AGENT_NAME: "agent",

    FILE_STORAGE_TYPE: {
        agent: "AGENT",
        volume: "VOLUME",
        gitlab: "GITLAB",
        gitlab_v3: "GITLAB_V3",
        github: "GITHUB",
        gerrit: "GERRIT"
    },

    SCM_TYPE_LIST: [
        {
            value: "GITLAB",
            name: "GitLab"
        },
        {
            value: "GITLAB_V3",
            name: "GitLab V3"
        },
        {
            value: "GITHUB",
            name: "GitHub"
        },
        {
            value: "GERRIT",
            name: "Gerrit Git"
        }
    ],

    /*
      priority: "RANK_1" ~ "RANK_20"
      1-4: scariest
      5-9: scary
      10-14: troubling
      15-20: concerning
    */
    RANK: {
        A: ["RANK_1", "RANK_2", "RANK_3", "RANK_4"],
        B: ["RANK_5", "RANK_6", "RANK_7", "RANK_8", "RANK_9"],
        C: ["RANK_10", "RANK_11", "RANK_12", "RANK_13", "RANK_14"],
        D: ["RANK_15", "RANK_16", "RANK_17", "RANK_18", "RANK_19", "RANK_20"]
    },

    SCAN_CONFIG_KEY_LIST: [
        "lang",
        "scanMemLimit",
        "jobQueueName",
        "prebuildCommand",
        "build",
        "builderPath",
        "buildArgs",
        "scanMode",
        "preprocessResultPath"
    ],

    BUILD_TOOLS: {
        C:  [
            { label: 'make', value: 'make' },
            { label: 'aos make', value: 'aos make' },
            { label: 'cmake', value: 'cmake' },
            { label: 'scons', value: 'scons' },
            { label: 'ninja', value: 'ninja' },
            { label: 'catkin_make', value: 'catkin_make' },
            { label: 'bazel', value: 'bazel' },
            { label: 'UV4.exe', value: 'UV4.exe', hasBuilderPath: true },
            { label: 'iar_build.exe', value: 'iar_build.exe', hasBuilderPath: true },
            { label: i18n.t('project.other'), value: 'other' }
        ],
        JAVA: [
            { label: 'mvn', value: 'mvn' },
            { label: 'gradle', value: 'gradle' },
            // { label: 'ant', value: 'ant' },
            { label: 'mvnw', value: 'mvnw', hasBuilderPath: true },
            { label: 'gradlew', value: 'gradlew', hasBuilderPath: true },
            // { label: i18n.t('project.other'), value: 'other' }
        ]
    },

    NOTIFICATION_IDS: {
        PROJECT_SETTING__INPUT_CHANGE: 'PROJECT_SETTING__INPUT_CHANGE'
    },

    RULE_MSG_TEMPL_KEYWORDS: {
        source: {
            file: '${so.file}',
            filename: '${so.filename}',
            func: '${so.func}',
            variable: '${so.var}',
            line: '${so.line}',
        },
        sink: {
            file: '${si.file}',
            filename: '${si.filename}',
            func: '${si.func}',
            variable: '${si.var}',
            line: '${si.line}',
        }
    },

    RULE_STANDARDS: [
        'owasp',
        // 'p3c-sec',
        'cwe',
    ],

    RULE_STANDARDS_MISRA: {
        mc: {
            displayName: 'MISRA C'
        },
        mcpp: {
            displayName: 'MISRA C++'
        }
    },

    ISSUE_GROUP_TYPE: {
        GENERAL: 'general',
        IGNORE: 'ignore',
        DSR_NEW: 'dsr_new',
        DSR_FIXED: 'dsr_fixed',
        DSR_OUTSTANDING: 'dsr_outstanding'
    },

    DSR_TYPE: {
        NEW: 'N',
        FIXED: 'F',
        OUTSTANDING: 'E',
        OUTSTANDING_ALL: ['E', 'P', 'L'],
    },

    RULE_TYPE: {
        RULESET: 'ruleset',
        STANDARD: 'standard',
        CUSTOM: 'custom'
    },

    SCAN_MODE: {
        SINGLE: 'SINGLE',
        CROSS: 'CROSS',
        SINGLE_XSCA: 'SINGLE_XSCA',
        XSCA: 'XSCA',
    },

    SCAN_MODE_ORIGINAL: {
        SINGLE: '-single',
        CROSS: '-cross',
        SINGLE_XSCA: '-single-xsca',
        XSCA: '-xsca',
    },

    CSV_REPORT_TYPE: {
        SINGLE: 'SINGLE',
        CROSS: 'CROSS',
        MISRA: 'MISRA',
    },

    ENABLE_CUSTOM_RULE: true,

    PDF: {
        WIDTH: 592,
        HEIGHT: 832,
        MARGIN: {
            TOP: '64pt',
            RIGHT: '30pt',
            LEFT: '30pt',
            BOTTOM: '45pt'
        }
    },

    REPO_ACTION: {
        CI: 'CI',
        CD: 'CD'
    },

    ISSUE_VALIDATION_ACTION: {
        UNDECIDED: 'UNDECIDED',
        TRUE_POSITIVE: 'TP',
        FALSE_POSITIVE: 'FP',
        IGNORE: 'IGNORE'
    },

    ISSUE_VALIDATION_SCOPE: {
        GLOBAL: 'GLOBAL',
        USER: 'USER',
        PROJECT: 'PROJECT'
    },

    ISSUE_VALIDATION_TYPE: {
        DEFAULT: 'DEFAULT',
        CUSTOM: 'CUSTOM'
    },

    VALIDATION_FILTER_TYPE: {
        ALL: 'ALL',
        IGNORE: 'IGNORE',
        NON_IGNORE: 'NON-IGNORE'
    },
}