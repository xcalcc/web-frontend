import * as utils from 'Utils';
import store from 'Store';
import enums from 'Enums';
import DTO from 'DTO';

export default {
    extractSummaryData(scanSummary) {
        if (!scanSummary) {
            return null;
        }

        const latestCompleteScanTask = scanSummary.latestCompleteScanTask || {};
        const issueSummary = latestCompleteScanTask.issueSummary || {};
        issueSummary.scanStartAt = latestCompleteScanTask.scanStartAt;
        issueSummary.scanEndAt = latestCompleteScanTask.scanEndAt;

        return issueSummary;
    },
    extractRuleSetData(ruleCodeCountMap) {
        let ruleSetCountMap = {};

        Object.keys(ruleCodeCountMap).forEach(csvCode => {
            const ruleInfo = this.getRuleInfo(csvCode);
            const ruleSet = ruleInfo && ruleInfo.ruleSet;
            const issueCount = Number(ruleCodeCountMap[csvCode]);
            if (ruleSet) {
                const ruleSetId = ruleSet.id;
                if (ruleSetCountMap.hasOwnProperty(ruleSetId)) {
                    ruleSetCountMap[ruleSetId].value +=issueCount;
                    ruleSetCountMap[ruleSetId].csvCodes.push(csvCode);
                } else {
                    ruleSetCountMap[ruleSetId] = {
                        label: ruleSet.displayName,
                        value: issueCount,
                        id: ruleSetId,
                        type: enums.RULE_TYPE.RULESET,
                        csvCodes: [csvCode]
                    }
                }
            }
        });

        return Object.keys(ruleSetCountMap).map(ruleSetId => {
            ruleSetCountMap[ruleSetId].value = utils.formatNumber(ruleSetCountMap[ruleSetId].value);
            return ruleSetCountMap[ruleSetId];
        });
    },
    extractStandardsData(standardName, ruleCodeCountMap) {
        if (!ruleCodeCountMap) {
            return {
                label: standardName.toUpperCase(),
                value: 0,
                ruleSetId: standardName,
                id: standardName
            };
        }
        const csvCodesWithStandard = [];

        //find standard related rules
        let totalStandardIssueCount = 0;
        ruleCodeCountMap && Object.keys(ruleCodeCountMap).forEach(csvCode => {
            const ruleInfo = this.getRuleInfo(csvCode);
            if (ruleInfo.standards && ruleInfo.standards[standardName]) {
                totalStandardIssueCount += Number(ruleCodeCountMap[csvCode]);
                csvCodesWithStandard.push(csvCode);
            }
        });

        return {
            label: standardName.toUpperCase(),
            value: utils.formatNumber(totalStandardIssueCount),
            issueCount: totalStandardIssueCount,
            id: standardName,
            type: enums.RULE_TYPE.STANDARD,
            csvCodes: csvCodesWithStandard
        };
    },
    extractCustomRuleSetData(ruleCodeCountMap, customRuleList) {
        let ruleSetCountMap = {};

        Object.keys(ruleCodeCountMap).forEach(customRuleCode => {
            const ruleInfo = customRuleList.find(x => x.code === customRuleCode);
            const ruleSet = ruleInfo && ruleInfo.ruleSet;
            const issueCount = Number(ruleCodeCountMap[customRuleCode]);
            if (ruleSet) {
                const ruleSetId = ruleSet.id;
                if (ruleSetCountMap.hasOwnProperty(ruleSetId)) {
                    ruleSetCountMap[ruleSetId].value += issueCount;
                    ruleSetCountMap[ruleSetId].csvCodes.push(customRuleCode);
                } else {
                    ruleSetCountMap[ruleSetId] = {
                        label: ruleSet.displayName,
                        value: issueCount,
                        id: ruleSetId,
                        type: enums.RULE_TYPE.CUSTOM,
                        csvCodes: [customRuleCode]
                    }
                }
            }
        });

        return Object.keys(ruleSetCountMap).map(ruleSetId => {
            ruleSetCountMap[ruleSetId].value = utils.formatNumber(ruleSetCountMap[ruleSetId].value);
            return ruleSetCountMap[ruleSetId];
        });
    },
    getRuleInfo(code) {
        const ruleState = store.getState()['rule'];
        const ruleList = ruleState['ruleList'] || [];
        const csvCodeRuleListIndexMap = ruleState['csvCodeRuleListIndexMap'];
        const customRuleList = ruleState['customRuleList'];

        let ruleInfo = ruleList[csvCodeRuleListIndexMap[code]] || ruleList.find(rule => rule.code === code);

        if(!ruleInfo) {
            const customRule = customRuleList.find(rule => rule.code === code);

            if(customRule) {
                ruleInfo = {
                    _isCustomRule: true,
                    ...customRule,
                }
            } else {
                ruleInfo = {};
            }
        }

        return ruleInfo;
    },
    getStandardAndRuleSetNames(csvCode) {
        let nameList = [];
        const ruleInfo = this.getRuleInfo(csvCode);
        const ruleSet = ruleInfo.ruleSet || {};

        ruleSet.displayName && nameList.push(ruleSet.displayName);

        enums.RULE_STANDARDS.forEach(standard => {
            if(ruleInfo.standards && ruleInfo.standards.hasOwnProperty(standard) && !!ruleInfo.standards[standard]) {
                nameList.push(standard);
            }
        });

        if(ruleInfo.isCustomRule) {
            const customRuleSet = ruleInfo.ruleSet || {};
            customRuleSet.displayName && nameList.push(customRuleSet.displayName);
        }

        return nameList;
    },
    getRuleSetAndStandardNamesByFilter(currentFilter) {
        const nameList = [];
        const ruleState = store.getState()['rule'];
        const ruleSetList = ruleState['ruleSetList'] || [];

        if(enums.RULE_STANDARDS_MISRA[currentFilter.standard]) {
            nameList.push(enums.RULE_STANDARDS_MISRA[currentFilter.standard].displayName);
        } else if (currentFilter.standard) {
            nameList.push(currentFilter.standard);
        }

        if (currentFilter.ruleSetId) {
            const ruleSet = ruleSetList.find(x => x.id === currentFilter.ruleSetId);
            ruleSet && nameList.push(ruleSet.displayName);
        }

        return nameList.length ? nameList : null;
    },
    cacheIssueFilterData({projectKey, filterData, isDsrPage, isMisraPage}) {
        let cacheData = utils.localStore.getDataRow(enums.SCAN_RESULT_CACHE_ID) || {};
        if(isMisraPage) {
            if(isDsrPage) {
                cacheData['misraDsrFilter'] = {
                    ...cacheData['misraDsrFilter'],
                    [projectKey]: filterData
                };
            } else {
                cacheData['misraFilter'] = {
                    ...cacheData['misraFilter'],
                    [projectKey]: filterData
                };
            }
        } else {
            if(isDsrPage) {
                cacheData['dsrFilter'] = {
                    ...cacheData['dsrFilter'],
                    [projectKey]: filterData
                };
            } else {
                cacheData['filter'] = {
                    ...cacheData['filter'],
                    [projectKey]: filterData
                };
            }
        }
        utils.localStore.setDataRow(enums.SCAN_RESULT_CACHE_ID, cacheData);
    },
    getFilterDataFromCache({isMisraPage, isDsrPage, projectKey}) {
        const scanResultCacheData = utils.localStore.getDataRow(enums.SCAN_RESULT_CACHE_ID) || {};
        let filterCacheData;
        if(isMisraPage) {
            filterCacheData = isDsrPage ? scanResultCacheData['misraDsrFilter'] : scanResultCacheData['misraFilter'];
        } else {
            filterCacheData = isDsrPage ? scanResultCacheData['dsrFilter'] : scanResultCacheData['filter'];
        }
        const currFilterCacheData = (filterCacheData && filterCacheData[projectKey]) || {};
        return currFilterCacheData;
    },
    updateCacheForIssueSearchKeyword({projectKey, keyword, isUpdateFavorite, isDelete, isMisraPage}) {
        if(!projectKey || !keyword) return;
        const dataKey = isMisraPage ? 'misraSearchKeyword' : 'searchKeyword';
        const limit = enums.ISSUE_SEARCH_KEYWORD_HISTORY_COUNT_LIMIT;
        const cacheData = utils.localStore.getDataRow(enums.SCAN_RESULT_CACHE_ID) || {};
        const allKeywords = cacheData[dataKey] || {};
        let projectKeywords = allKeywords[projectKey] || [];

        if(isDelete) {
            // delete keyword
            projectKeywords = projectKeywords.filter(x => x.keyword !== keyword);
        } else {
            const current = projectKeywords.find(x => x.keyword === keyword);
            if(!current) {
                // add keyword
                projectKeywords.push({
                    keyword,
                    isFavorite: false,
                    date: +new Date()
                });
            } else if(isUpdateFavorite) {
                // update keyword
                current.isFavorite = !current.isFavorite;
                current.date = +new Date();
            }
        }

        if(projectKeywords.length > limit) {
            // delete the oldest data if the storage limit is exceeded
            const minimumDateKeyword = projectKeywords
                .filter(x => !x.isFavorite)
                .reduce((acc, curr) => {
                    return acc.date > curr.date ? curr : acc;
                });
            projectKeywords = projectKeywords.filter(x => x.keyword !== minimumDateKeyword.keyword);
        }

        cacheData[dataKey] = {
            ...cacheData[dataKey],
            [projectKey]: projectKeywords
        };
        utils.localStore.setDataRow(enums.SCAN_RESULT_CACHE_ID, cacheData);
    },
    getRuleSetInfoFromRuleSetCode(rulesetId) {
        const ruleState = store.getState()['rule'];
        const ruleSetList = ruleState['ruleSetList'];
        let targetRuleset = ruleSetList.find(ruleset => ruleset.id === rulesetId);
        if (!targetRuleset && enums.RULE_SET_ID_STANDARD_MAP.hasOwnProperty(rulesetId)) {
            targetRuleset = enums.RULE_SET_ID_STANDARD_MAP[rulesetId];
        }
        return targetRuleset;
    },
    addRuleCodesToFilterObj(filter, issueGroupSummaryCount, customRuleList) {
        let ruleCodes = [];
        switch(filter.type) {
            case enums.RULE_TYPE.STANDARD:
                const standardData = this.extractStandardsData(filter.standard, issueGroupSummaryCount.ruleCodeCountMap);
                ruleCodes = [{
                    ruleCode: null,
                    csvCodes: standardData.csvCodes,
                    criticality: ''
                }];
                break;
            case enums.RULE_TYPE.CUSTOM:
                const customRuleDatas = utils.scanResultHelper.extractCustomRuleSetData(issueGroupSummaryCount.ruleCodeCountMap, customRuleList);
                const customRuleData = customRuleDatas.find(x => x.id === filter.customRuleSetId) || {};
                ruleCodes = [{
                    ruleCode: null,
                    csvCodes: customRuleData.csvCodes,
                    criticality: ''
                }];
                break;
            default:
                break;
        }
        return ruleCodes;
    },
    remapRuleCodePayload(ruleCodes = []) {
        if (!ruleCodes.length || !Array.isArray(ruleCodes)) return [];
        const ruleCodePayload = [];
        const newRuleCodes = ruleCodes.filter(ruleObjItem => 
            !['all-H', 'all-M', 'all-L'].includes(ruleObjItem.csvCodes[0])
        );

        newRuleCodes.forEach(ruleObj => {
            ruleObj.csvCodes.forEach(csvCode => {
                ruleCodePayload.push(DTO.ruleCodeDTO({
                    ...ruleObj,
                    csvCode: csvCode,
                }));
            })
        });

        return ruleCodePayload;
    },
    sortCriticalityGroupData: (groupCode, groupDataList, groupSortBy = 1) => {
        const pageState = store.getState()['page'];
        const currentFilter = pageState.scanResult.filter;
        const ruleCodes = currentFilter.ruleCodes || [];

        groupDataList.sort((a, b) => {
            const isSelectedA = ruleCodes.findIndex(x => x.ruleCode === a.ruleCode) > -1;
            const isSelectedB = ruleCodes.findIndex(x => x.ruleCode === b.ruleCode) > -1;

            if(b.id === `all-${groupCode}`) {
                return 1;
            }
            else if(isSelectedA && !isSelectedB) {
                return -1;
            }
            else if(isSelectedB && !isSelectedA) {
                return 1;
            }

            let compareResult;

            switch(groupSortBy) {
                case 1:
                    compareResult = utils.compareString(a.label, b.label, '_');
                    break;
                case 2:
                    compareResult = b.value - a.value;
                    break;
                default:
                    break;
            }

            return compareResult;
        });
        return groupDataList;
    }
}
