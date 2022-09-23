import React, {useEffect, useState, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Container, Row, Col} from 'react-bootstrap';
import {InfoCircle} from 'react-bootstrap-icons';
import * as actions from 'Actions';
import i18n from 'i18next';
import enums from 'Enums';
import * as utils from 'Utils';
import TooltipWrapper from 'Components/TooltipWrapper';
import HorizontalList from './_partials/HorizontalList';
import VerticallyList from './_partials/VerticallyList';

import './style.scss';

const TopIssues = props => {
    const {
        isDsrPage,
        scanTaskId
    } = props;

    const dispatch = useDispatch();
    const scanResultAction = actions.getPageActions('scanResult');
    const criticalityCountMap = useSelector(state => state.page.scanResult.topIssue.criticalityCountMap);
    const ruleList = useSelector(state => state.rule.ruleList);

    const [currentTabsId, /*setCurrentTabsId*/] = useState('ALL');
    const [ruleSetAndStandardMaps, setRuleSetAndStandardMaps] = useState([]);
    const [issueTotalCount, setIssueTotalCount] = useState(0);

    const mergeCriticalityCsvCodeCountMap = criticalityRuleCodeCountMap => {
        let totalCount = 0;
        const summary = {};
        Object.keys(criticalityRuleCodeCountMap).forEach(criticality => {
            const csvCodeCountMap = criticalityRuleCodeCountMap[criticality] || {};
            Object.keys(csvCodeCountMap).forEach(csvCode => {
                if (summary.hasOwnProperty(csvCode)) {
                    summary[csvCode] += Number(csvCodeCountMap[csvCode]);
                } else {
                    summary[csvCode] = Number(csvCodeCountMap[csvCode]);
                }
                totalCount += Number(csvCodeCountMap[csvCode]);
            });
        });
        return {
            totalCount,
            allCsvCodeCountMap: summary,
            highCsvCodeCountMap: criticalityRuleCodeCountMap[enums.ISSUE_CRITICALITY.high] || {}
        };
    }

    const buildRuleSetCounts = ruleCodeCountMap => {
        return utils.scanResultHelper.extractRuleSetData(ruleCodeCountMap);
    }

    const buildStandardCounts = ruleCodeCountMap => {
        return enums.RULE_STANDARDS.map(standard => {
            return utils.scanResultHelper.extractStandardsData(standard, ruleCodeCountMap);
        })
    }

    const buildRuleSetAndStandardList = allCsvCodeCountMap => {
        const ruleSetAll = {
            label: i18n.t('pages.scan-result.all'),
            id: 'ALL',
            value: 0,
            csvCodes: Object.keys(allCsvCodeCountMap)
        };

        return [
            ruleSetAll,
            ...buildRuleSetCounts(allCsvCodeCountMap),
            ...buildStandardCounts(allCsvCodeCountMap)
        ];
    }

    const buildRenderData = criticalityRuleCodeCountMap => {
        let csvCodeListForNotExist = [];
        const csvCodeSummaryCountMap = mergeCriticalityCsvCodeCountMap(criticalityRuleCodeCountMap);
        const ruleSetAndStandards = buildRuleSetAndStandardList(csvCodeSummaryCountMap.allCsvCodeCountMap);

        ruleSetAndStandards.forEach(ruleSetData => {
            ruleSetData.highRiskCount = 0;
            ruleSetData.ruleList = [];

            Object.keys(csvCodeSummaryCountMap.highCsvCodeCountMap).forEach(csvCode => {
                if (ruleSetData.csvCodes.includes(csvCode)) {
                    ruleSetData.highRiskCount += Number(csvCodeSummaryCountMap.highCsvCodeCountMap[csvCode]) || 0;
                }
            });

            Object.keys(csvCodeSummaryCountMap.allCsvCodeCountMap).forEach(csvCode => {
                const ruleInfo = utils.scanResultHelper.getRuleInfo(csvCode);
                if (!ruleInfo.code) {
                    !csvCodeListForNotExist.includes(csvCode) && csvCodeListForNotExist.push(csvCode);
                }
                if (ruleSetData.csvCodes.includes(csvCode)) {
                    // merge duplicate rule code
                    const currRuleObj = ruleSetData.ruleList.find(x => x.ruleCode === ruleInfo.code);
                    if(currRuleObj) {
                        currRuleObj.csvCodes.push(csvCode);
                        currRuleObj.issueCount += Number(csvCodeSummaryCountMap.allCsvCodeCountMap[csvCode]) || 0;
                    } else {
                        ruleSetData.ruleList.push({
                            ruleCode: ruleInfo && (ruleInfo.code || csvCode),
                            ruleName: ruleInfo && ruleInfo.name,
                            csvCodes: [csvCode],
                            issueCount: Number(csvCodeSummaryCountMap.allCsvCodeCountMap[csvCode]) || 0
                        });
                    }
                }
            });

            ruleSetData.ruleList.sort((a, b) => a.issueCount > b.issueCount ? -1 : 1);
        });

        if (csvCodeListForNotExist.length > 0) {
            console.error(`csvcode cannot be found: ${csvCodeListForNotExist.join(',')}`)
        }

        setIssueTotalCount(csvCodeSummaryCountMap.totalCount);
        setRuleSetAndStandardMaps(ruleSetAndStandards);
    }

    const ruleCountMapList = useMemo(() => {
        const data = ruleSetAndStandardMaps.find(x => x.id === currentTabsId) || {};
        const ruleCountList = data.ruleList || [];
        return ruleCountList.slice(0, 10);
    }, [currentTabsId, ruleSetAndStandardMaps]);

    const [highRiskCount, chartPercentage] = useMemo(() => {
        const data = ruleSetAndStandardMaps.find(x => x.id === currentTabsId) || {};
        const percentage = issueTotalCount > 0
            ? utils.formatPercentage(data.highRiskCount / issueTotalCount * 100).string
            : 0;
        return [data.highRiskCount, percentage];
    }, [currentTabsId, ruleSetAndStandardMaps]);

    useEffect(() => {
        if (ruleList.length === 0 || !criticalityCountMap.criticalityRuleCodeCountMap) return;
        buildRenderData(criticalityCountMap.criticalityRuleCodeCountMap);
    }, [ruleList, criticalityCountMap]);

    useEffect(() => {
        dispatch(scanResultAction.fetchCriticalityRuleCodeCountForTopIssue({
            scanTaskId,
            dsrType: [enums.DSR_TYPE.NEW, ...enums.DSR_TYPE.OUTSTANDING_ALL],
            ruleSets: enums.BUILTIN_RULE_SETS
        }));
    }, [scanTaskId]);

    return <Container className="top-issues noPadding" fluid>
        <Row>
            <Col className="header">
                <div className="title">
                    {i18n.t('pages.scan-result.statistic-view.top-issues')}
                    {
                        ruleCountMapList.length >= 10 &&
                        <div className="tooltip-icon">
                            <TooltipWrapper
                                tooltipText={i18n.t('pages.scan-result.tooltip.top-issues-tip')}
                                children={<InfoCircle/>}
                                options={
                                    {
                                        placement: 'top',
                                    }
                                }
                            />
                        </div>
                    }
                </div>
                {/* Not show ruleset */
                    /* <ul className="ruleset-list">
                        {
                            ruleSetAndStandardMaps.map((data, idx) =>
                                <li
                                    key={idx}
                                    className={classNames({active: data.id === currentTabsId})}
                                    onClick={() => setCurrentTabsId(data.id)}
                                >
                                    {data.label}
                                </li>
                            )
                        }
                    </ul> */}
            </Col>
        </Row>
        <Row>
            {
                isDsrPage 
                    ? <VerticallyList
                        ruleCountMapList={ruleCountMapList}
                        highRiskCount={highRiskCount}
                        chartPercentage={chartPercentage}
                        issueTotalCount={issueTotalCount}
                    />
                    : <HorizontalList 
                        ruleCountMapList={ruleCountMapList}
                        highRiskCount={highRiskCount}
                        chartPercentage={chartPercentage}
                        issueTotalCount={issueTotalCount}
                    />
            }
        </Row>
    </Container>
}

export default TopIssues;
