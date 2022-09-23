import * as utils from "Utils";

/**
 * Warning, Array.prototype.sort is mutable!!!
 */
export default {
    sortByName: (data, field, sortDirection = 1) => [...data].sort((a, b) => a.name && sortDirection * a.name.localeCompare(b.name)),
    sortByScanTime: (data, field, sortDirection = 1) => [...data].sort((a, b) => {
        let result = 0;
        let aTime = a[field] ? utils.parseDate(a[field]).getTime() : 0;
        let bTime = b[field] ? utils.parseDate(b[field]).getTime() : 0;

        result = sortDirection * (aTime > bTime ? 1 : -1);
        return result;
    }),
    sortByLang: (data, field, sortDirection = 1) => [...data].sort((a, b) => sortDirection * a.langList.join("/").localeCompare(b.langList.join("/"))),
    sortByIssueCount: (data, field, sortDirection, selectedRuleSetId) => data.sort((a, b) => {
        const aSummary = a['summary'] || {};
        const bSummary = b['summary'] || {};
        const aRuleSetSummaryMap = aSummary['ruleSetSummaryMap'] || {};
        const bRuleSetSummaryMap = bSummary['ruleSetSummaryMap'] || {};

        const aRuleSetSummaryData = aRuleSetSummaryMap[selectedRuleSetId];
        const bRuleSetSummaryData = bRuleSetSummaryMap[selectedRuleSetId];

        const aValue = Number(aRuleSetSummaryData[field]) || -100;
        const bValue = Number(bRuleSetSummaryData[field]) || -100;

        return sortDirection * (aValue > bValue ? 1 : -1);
    }),
}