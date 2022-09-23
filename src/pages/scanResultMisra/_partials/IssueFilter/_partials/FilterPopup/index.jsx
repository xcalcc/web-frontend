import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Container, Row, Col} from 'react-bootstrap';
import {useRouteMatch} from 'react-router-dom';
import i18n from 'i18next';
import * as utils from 'Utils';
import Enums from 'Enums';
import * as actions from 'Actions';
import Loader from 'Components/Loader';
import RuleSetBlock from './_partials/RuleSetBlock';
import RuleBlock from './_partials/RuleBlock';

import './style.scss';

const FilterWithRules = props => {
    const {
        scanTaskId,
        isDsrPage,
        isToggleHidePopup,
        onHidePopup
    } = props;

    const DEFAULT_GROUP_BY_SEVERITY = {
        H: [],
        M: [],
        L: [],
    };
    const currentFilter = useSelector(state => state.page.scanResult.filter);
    const scanSummary = useSelector(state => state.scan.currentScanSummary);
    const criticalityCount = useSelector(state => state.page.scanResult.sidebarSummary.criticalityCount);
    const groupSummaryCount = useSelector(state => state.page.scanResult.sidebarSummary.groupSummaryCount);

    const dispatch = useDispatch();
    const routeMatch = useRouteMatch();
    const [isLoading, setIsLoading] = useState(false);
    const scanResultAction = actions.getPageActions('scanResult');
    const [issueGroupSummaryCount, setIssueGroupSummaryCount] = useState(groupSummaryCount || {});
    const [issueGroupCriticalitySummaryCount, setIssueGroupCriticalitySummaryCount] = useState(criticalityCount || {});
    const csvCodeRuleListIndexMap = useSelector(state => state.rule.csvCodeRuleListIndexMap);
    const customRuleList = useSelector(state => state.rule.customRuleList);
    const enableApi = useSelector(state => state.page.scanResult.enableApi);
    const [ruleSetsWithIssues, setRuleSetsWithIssues] = useState([]);
    const [groupBySeverity, setGroupBySeverity] = useState(DEFAULT_GROUP_BY_SEVERITY);
    const [currentTempFilter, setCurrentTempFilter] = useState(currentFilter);
    const [standardRuleCodeCache, setStandardRuleCodeCache] = useState([]);

    const projectKey = routeMatch.params.projectKey;

    const buildRuleSetFilter = issueGroupSummaryCount => {
        setRuleSetsWithIssues([
            ...buildStandardCounts(issueGroupSummaryCount.ruleCodeCountMap),
            ...buildRuleSetCounts(issueGroupSummaryCount.ruleCodeCountMap)
        ]);
    }
    const buildRuleSetCounts = ruleCodeCountMap => {
        if (!ruleCodeCountMap) {
            return [];
        }
        const ruleSetCounts = utils.scanResultHelper.extractRuleSetData(ruleCodeCountMap);
        // only show Aoutsar, not Misra rule set, Misra is displayed as Misra C and C++ standards
        return ruleSetCounts.filter(x => x.id !== Enums.RULE_SET.MISRA);
    }
    const buildStandardCounts = ruleCodeCountMap => {
        const standardCounts = Object.keys(Enums.RULE_STANDARDS_MISRA).map(standard => {
            return utils.scanResultHelper.extractStandardsData(standard, ruleCodeCountMap);
        });
        standardCounts.forEach(data => {
            data.label = Enums.RULE_STANDARDS_MISRA[data.id] && Enums.RULE_STANDARDS_MISRA[data.id].displayName;
        });
        return standardCounts.filter(x => x.issueCount > 0);
    }

    const buildCriticalityFilter = issueGroupCriticalitySummaryCount => {
        if (!enableApi || !issueGroupCriticalitySummaryCount) return;
        const ruleCodeCountMap = issueGroupCriticalitySummaryCount.criticalityRuleCodeCountMap || {};

        let group = DEFAULT_GROUP_BY_SEVERITY;
        Object
            .keys(ruleCodeCountMap).forEach(riskType => {
            let severityGroupKey = '';
            switch (riskType) {
                case 'HIGH':
                    severityGroupKey = 'H';
                    break;
                case 'MEDIUM':
                    severityGroupKey = 'M';
                    break;
                case 'LOW':
                    severityGroupKey = 'L';
                    break;
                default:
                    break;
            }
            Object.keys(ruleCodeCountMap[riskType])
                .forEach(csvCode => {
                    const issueGroupCount = Number(ruleCodeCountMap[riskType][csvCode]);
                    if(issueGroupCount === 0) return;

                    const ruleInfo = utils.scanResultHelper.getRuleInfo(csvCode);
                    const ruleCode = ruleInfo.code || csvCode;
                    const currRuleObj = group[severityGroupKey].find(x => x.ruleCode === ruleInfo.code);

                    if(currRuleObj) {
                        // merge duplicate rule code
                        currRuleObj.csvCodes.push(csvCode);
                        currRuleObj.value += issueGroupCount;
                    } else {
                        group[severityGroupKey].push({
                            label: ruleCode,
                            value: issueGroupCount,
                            csvCodes: [csvCode],
                            ruleCode: ruleCode,
                            id: `${ruleCode}-${severityGroupKey}`,
                            criticality: severityGroupKey
                        });
                    }
                });
        });

        Object.keys(group).forEach(severity => {
            //add all counts for each severity
            group[severity].unshift({
                label: i18n.t(`pages.scan-result.side-bar.severity-total-misra`, {
                    severity: i18n.t(`pages.scan-result.side-bar.obligation.${severity}`)
                }),
                value: Object.keys(group[severity]).reduce((accumulator, currentValue) => Number(group[severity][currentValue]['value']) + accumulator, 0) || 0,
                csvCodes: [`all-${severity}`],
                ruleCode: `all-${severity}`,
                id: `all-${severity}`
            });
            utils.scanResultHelper.sortCriticalityGroupData(severity, group[severity]);
        });
        setGroupBySeverity(group);
    }
    //api dispatch
    const fetchSummaryForRuleSet = async (filter = currentFilter) => {
        let newFilter = {
            ...filter,
            ruleSetId: '',
            ruleCodes: undefined
        };

        const filterPayload = await dispatch(actions.getPayloadOfSearchIssue({
            isDsrPage,
            isMisraPage: true,
            scanTaskId: scanTaskId,
            currentFilter: newFilter,
            certainty: filter.includePossibleDefect ? undefined : Enums.ISSUE_CERTAINTY.D
        }));

        const summaryCount = await dispatch(scanResultAction.fetchScanSummaryCount(filterPayload));
        setIssueGroupSummaryCount(summaryCount);
    }
    const fetchSummaryForCriticalGroup = async (filter = currentFilter) => {
        let newFilter = {...filter};
        newFilter.ruleCodes = utils.scanResultHelper.addRuleCodesToFilterObj(newFilter, issueGroupSummaryCount, customRuleList);

        const filterPayload = await dispatch(actions.getPayloadOfSearchIssue({
            isDsrPage,
            isMisraPage: true,
            scanTaskId: scanTaskId,
            currentFilter: newFilter,
        }));

        const criticalitySummaryCount = await dispatch(scanResultAction.fetchScanSummaryCriticalityCount(filterPayload));
        setIssueGroupCriticalitySummaryCount(criticalitySummaryCount);
    }

    const onClearFilter = async () => {
        await dispatch(scanResultAction.toggleAPIOnOff(1));

        const newFilter = {
            ...currentFilter,
            ruleSetId: '',
            ruleCodes: [],
            includePossibleDefect: true,
            standard: '',
            customRuleSetId: '',
            id: '',
            type: '',
            issueCount: undefined,
        }
        setCurrentTempFilter(newFilter);
    }
    const onSelectRuleSetFilter = async ruleSetData => {
        if (!scanSummary) return;
        setStandardRuleCodeCache([]);

        let newFilter = currentTempFilter;

        if(ruleSetData.id === currentTempFilter.id) {
            // deselect
            newFilter = {
                ...newFilter,
                ruleSetId: null,
                ruleCodes: [],
                standard: null,
                type: null,
                id: null,
                customRuleSetId: '',
                issueCount: undefined,
            };
        } else if (ruleSetData.type === Enums.RULE_TYPE.STANDARD) {
            newFilter = {
                ...newFilter,
                ruleCodes: [{
                    ...ruleSetData,
                    ruleCode: null,
                    csvCodes: ruleSetData.csvCodes,
                    criticality: ''
                }],
                type: Enums.RULE_TYPE.STANDARD,
                standard: ruleSetData.id,
                ruleSetId: null,
                id: ruleSetData.id,
                issueCount: ruleSetData.value,
                customRuleSetId: ''
            };
            //cache those rule codes for standards
            setStandardRuleCodeCache(newFilter.ruleCodes);
        } else if (ruleSetData.type === Enums.RULE_TYPE.CUSTOM) {
            newFilter = {
                ...newFilter,
                ruleCodes: [{
                    ...ruleSetData,
                    ruleCode: null,
                    csvCodes: ruleSetData.csvCodes,
                    criticality: ''
                }],
                type: Enums.RULE_TYPE.CUSTOM,
                id: ruleSetData.id,
                ruleSetId: '',
                standard: '',
                issueCount: ruleSetData.value,
                customRuleSetId: ruleSetData.id
            };
            //cache those rule codes for standards
            setStandardRuleCodeCache(newFilter.ruleCodes);
        } else {
            newFilter = {
                ...newFilter,
                standard: '',
                ruleSetId: ruleSetData.id,
                ruleCodes: [],
                type: Enums.RULE_TYPE.RULESET,
                id: ruleSetData.id,
                issueCount: ruleSetData.value,
                customRuleSetId: ''
            };
        }

        setCurrentTempFilter(newFilter);
    }
    const onSelectRule = ruleObj => {
        let currentFilterRuleObjList = (currentTempFilter && currentTempFilter.ruleCodes) || [];
        const handleGroupSelect = groupCode => {
            if (currentFilterRuleObjList.find(ruleObjItem => ruleObjItem.id === `all-${groupCode}`)) {
                //deselect all under same criticality
                currentFilterRuleObjList = groupBySeverity[groupCode].reduce((acc, curr) => {
                    return acc.filter(item => item.id !== curr.id);
                }, [...currentFilterRuleObjList]);
            } else {
                //select all under groupCode
                currentFilterRuleObjList = [
                    ...currentFilterRuleObjList,
                    ...groupBySeverity[groupCode]
                ];
            }
        }
        switch (ruleObj.id) {
            case 'all-H':
                handleGroupSelect('H');
                break;
            case 'all-M':
                handleGroupSelect('M');
                break;
            case 'all-L':
                handleGroupSelect('L');
                break;
            default:
                //when single rule is selected, deselect all under the criticality group
                switch (ruleObj.criticality) {
                    case 'H':
                        currentFilterRuleObjList = currentFilterRuleObjList
                            .filter(ruleObjItem => ruleObjItem.id !== 'all-H');
                        break;
                    case 'M':
                        currentFilterRuleObjList = currentFilterRuleObjList
                            .filter(ruleObjItem => ruleObjItem.id !== 'all-M');
                        break;
                    case 'L':
                        currentFilterRuleObjList = currentFilterRuleObjList
                            .filter(ruleObjItem => ruleObjItem.id !== 'all-L');
                        break;
                    default:
                        return;
                }
                //on off toggle of rule code
                if (currentFilterRuleObjList.find(ruleObjItem => ruleObjItem.id === ruleObj.id)) {
                    currentFilterRuleObjList = currentFilterRuleObjList.filter(ruleObjItem => ruleObjItem.id !== ruleObj.id);
                } else {
                    currentFilterRuleObjList = [
                        ...currentFilterRuleObjList,
                        ruleObj
                    ];
                }
                break;
        }
        //filter those empty criticality rules created by standards
        currentFilterRuleObjList = currentFilterRuleObjList.filter(ruleObjItem => ruleObjItem.criticality !== '');

        //dedup
        const currentFilterRuleObjSet = new Set(currentFilterRuleObjList);

        const newFilter = {
            ...currentTempFilter,
            ruleCodes: Array.from(currentFilterRuleObjSet),
        };

        //when deselect all, need to restore the state rule/ruleSet selected state
        if ([Enums.RULE_TYPE.STANDARD, Enums.RULE_TYPE.CUSTOM].includes(currentTempFilter.type) 
            && !newFilter.ruleCodes.length 
            && standardRuleCodeCache.length
        ) {
            newFilter.ruleCodes = standardRuleCodeCache;
        }

        setCurrentTempFilter(newFilter);
    }
    const onCancelFilter = () => {
        onHidePopup && onHidePopup();
        setCurrentTempFilter(currentFilter);
    }
    const onApplyFilter = () => {
        onHidePopup && onHidePopup();
        if ([Enums.RULE_TYPE.RULESET, Enums.RULE_TYPE.STANDARD].includes(currentTempFilter.type)) {
            if (Number(currentTempFilter.issueCount) === 0) {
                dispatch(scanResultAction.resetScanResultIssueGroupData(Enums.ISSUE_GROUP_TYPE.GENERAL));
                dispatch(scanResultAction.toggleAPIOnOff(0));
                setGroupBySeverity(DEFAULT_GROUP_BY_SEVERITY);
            } else {
                dispatch(scanResultAction.toggleAPIOnOff(1));
            }
        }

        let filterData = {
            ...currentTempFilter,
            searchValue: currentFilter.searchValue
        };

        utils.scanResultHelper.cacheIssueFilterData({
            projectKey,
            filterData,
            isDsrPage,
            isMisraPage: true
        });
        dispatch(scanResultAction.setIssueFilter(filterData));
    }

    //state monitoring
    useEffect(() => {
        if (isToggleHidePopup) {
            setCurrentTempFilter(currentFilter);
        }
    }, [isToggleHidePopup]);

    useEffect(() => {
        //update ruleset all counts
        buildRuleSetFilter(issueGroupSummaryCount);
    }, [csvCodeRuleListIndexMap, issueGroupSummaryCount]);

    //update tempFilter when searchValue is updated
    useEffect(() => {
        const newFilter = {
            ...currentFilter,
            searchValue: currentFilter.searchValue
        };
        setCurrentTempFilter(newFilter);
    }, [
        currentFilter.searchValue
    ]);

    useEffect(() => {
        if (utils.isEmptyObject(issueGroupSummaryCount)) return;

        (async () => {
            setIsLoading(true);
            await fetchSummaryForCriticalGroup(currentTempFilter);
            setIsLoading(false);
        })();
    }, [
        issueGroupSummaryCount,
        currentTempFilter.ruleSetId,
        currentTempFilter.standard,
        currentTempFilter.searchValue
    ]);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            await fetchSummaryForRuleSet(currentTempFilter);
            setIsLoading(false);
        })();
    }, [currentTempFilter.searchValue]);

    useEffect(() => {
        buildCriticalityFilter(issueGroupCriticalitySummaryCount);
    }, [issueGroupCriticalitySummaryCount, currentFilter.ruleCodes]);

    return <Container className="misra-filter-popup" fluid>
        {isLoading && <Loader />}
        <Row className="header">
            <Col className="title">{i18n.t('pages.scan-result.side-bar.filter')}</Col>
            <Col className="links">
                <span onClick={() => onClearFilter()}>
                    {i18n.t('pages.scan-result.side-bar.reset')}
                </span>
            </Col>
        </Row>
        <Row noGutters>
            <Col xs={3}>
                <div className="rule-set-area">
                    <RuleSetBlock
                        currentFilter={currentTempFilter}
                        ruleSetsWithIssues={ruleSetsWithIssues}
                        onSelectRuleSetFilter={onSelectRuleSetFilter}
                    />
                </div>
            </Col>
            <Col xs={9}>
                <div className="rule-area">
                    <RuleBlock
                        currentFilter={currentTempFilter}
                        groupBySeverity={groupBySeverity}
                        onSelectRule={onSelectRule}
                    />
                </div>
            </Col>
        </Row>
        <Row>
            <Col>
                <div className="button-area">
                    <button
                        className="btn btn-cancel"
                        onClick={onCancelFilter}
                    >
                        {i18n.t('common.buttons.cancel')}
                    </button>
                    <button
                        className="btn btn-apply"
                        onClick={onApplyFilter}
                    >
                        {i18n.t('common.buttons.apply-save')}
                    </button>
                </div>
            </Col>
        </Row>
    </Container>;
}

export default FilterWithRules;