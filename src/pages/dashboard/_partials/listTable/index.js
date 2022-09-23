import React, {useState} from "react";
import * as utils from "Utils";
import classNames from "classnames";
import {Image} from 'react-bootstrap';
import i18n from 'i18next';
import enums from 'Common/enumeration';
import SortingTable from 'Components/SortingTable';
import TrendIcon from "Components/TrendIcon";
import ScanFailIcon from 'Containers/ScanFailIcon';

import TriangleIcon from 'Icons/triangle.svg';
import './list-view.scss';

const DEFAULT_PAGE_SIZE = 15;
const defaultPagingState = {
    pageSize: DEFAULT_PAGE_SIZE,
    currentPage: 1
};

/**
 * headerSettings & renderTable need to be provided
 * @param props
 * @returns {*}
 */
export default props => {
    const {
        isLoading,
        sorting,
        onSort,
        onProjectClick,
        onGotoDsrPage,
    } = props;
    const [tablePaging, setTablePaging] = useState(defaultPagingState);

    const selectedRuleSetId = enums.RULE_SET.ALL;
    const generalSorting = (data, field, sortDirection) => data.sort((a, b) => {
        let result = 0;
        let aValue = (a['summary'] || {})[field] || "";
        let bValue = (b['summary'] || {})[field] || "";

        aValue = Number(aValue) || -100;
        bValue = Number(bValue) || -100;
        result = sortDirection * (aValue > bValue ? 1 : -1);
        return result;
    });
    const sortByRiskLevelCount = (data, field, sortDirection) => data.sort((a, b) => {
        let result = 0;
        let aRuleSetSummaryData = getRuleSetSummaryData(a, selectedRuleSetId);
        let bRuleSetSummaryData = getRuleSetSummaryData(b, selectedRuleSetId);

        let aCriticality = aRuleSetSummaryData['criticality'] || {};
        let bCriticality = bRuleSetSummaryData['criticality'] || {};

        let aValue = aCriticality[field] || "";
        let bValue = bCriticality[field] || "";

        aValue = Number(aValue) || -100;
        bValue = Number(bValue) || -100;
        result = sortDirection * (aValue > bValue ? 1 : -1);
        return result;
    });
    const getRuleSetSummaryData = (data, ruleSetId) => {
        const summary = data['summary'] || {};
        const ruleSetSummaryMap = summary['ruleSetSummaryMap'] || {};
        return ruleSetSummaryMap[ruleSetId] || {};
    };
    const handlePageChange = page => {
        setTablePaging({
            ...tablePaging,
            currentPage: page
        });
    }
    const handlePageSizeChange = pageSize => {
        setTablePaging({
            ...tablePaging,
            pageSize,
        });
    }
    const sortByName = utils.sort.sortByName;
    const sortByScanTime = utils.sort.sortByScanTime;
    const sortByIssueCount = utils.sort.sortByIssueCount;
    const headerSettings = [
        {
            field: 'name',
            label: utils.language("project_name"),
            sortFn: (...args) => {
                onSort('name', args[2]);
                return sortByName(...args);
            },
        },
        {
            field: 'issuesCount',
            label: i18n.t('common.scan-mode.title'),
            sortFn: (...args) => {
                onSort('issuesCount', args[2]);
                return sortByIssueCount(...args, selectedRuleSetId);
            },
        },
        {
            field: 'scanTime',
            label: utils.language("last_scan"),
            sortFn: (...args) => {
                onSort('scanTime', args[2]);
                return sortByScanTime(...args);
            },
        },
        {
            field: 'fileCount',
            label: utils.language("total_files"),
            sortFn: (...args) => {
                onSort('fileCount', args[2]);
                return generalSorting(...args);
            },
        },
        {
            field: 'lineCount',
            label: utils.language("total_lines"),
            sortFn: (...args) => {
                onSort('lineCount', args[2]);
                return generalSorting(...args);
            },
        },
        {
            field: 'HIGH', 
            label: utils.language("high"),
            className: 'risk-level high',
            sortFn: (...args) => {
                onSort('HIGH', args[2]);
                return sortByRiskLevelCount(...args);
            },
        },
        {
            field: 'MEDIUM', 
            label: utils.language("medium"),
            className: 'risk-level medium',
            sortFn: (...args) => {
                onSort('MEDIUM', args[2]);
                return sortByRiskLevelCount(...args);
            },
        },
        {
            field: 'LOW', 
            label: utils.language("low"),
            className: 'risk-level low',
            sortFn: (...args) => {
                onSort('LOW', args[2]);
                return sortByRiskLevelCount(...args);
            },
        },
        {
            field: 'issuesCount',
            label: utils.language("table_issue_total"),
            sortFn: (...args) => {
                onSort('issuesCount', args[2]);
                return sortByIssueCount(...args, selectedRuleSetId);
            },
        },
        {
            field: 'action',
            label: ''
        }
    ];

    const renderTable = tableData => tableData.map(data => {
        const summary = data.summary || {};
        const lastScanTask = data.lastScanTask || {};
        const ruleSetSummaryMap = summary.ruleSetSummaryMap || {};
        const allIssueCount = (ruleSetSummaryMap['all'] || {}).issuesCount;
        const isScanSuccessful = utils.isNumber(allIssueCount);
        const ruleSetSummaryData = ruleSetSummaryMap[selectedRuleSetId] || {};

        ruleSetSummaryData['criticality'] = ruleSetSummaryData.criticality || {};
        if(isScanSuccessful) {
            ruleSetSummaryData['criticality'].HIGH = ruleSetSummaryData['criticality'].HIGH || 0;
            ruleSetSummaryData['criticality'].MEDIUM = ruleSetSummaryData['criticality'].MEDIUM || 0;
            ruleSetSummaryData['criticality'].LOW = ruleSetSummaryData['criticality'].LOW || 0;
        }

        const isLastScanFailed = lastScanTask.status === enums.SCAN_TASK_STATUS.failed
                              || lastScanTask.status === enums.SCAN_TASK_STATUS.terminated
                              || data.scanningStatus === enums.NOTIFICATION_TASK_STATUS.FAILED
                              || data.scanningStatus === enums.NOTIFICATION_TASK_STATUS.FATAL;

        return (
            <tr 
                key={data.id}
                className={classNames({'scan-fail': !isScanSuccessful})}
                onClick={(event) => onProjectClick(event, data.id)}
            >
                <td className="p-name">
                    <p>{data.name}</p>
                    <span className="p-icon">
                        {
                            isLastScanFailed && 
                            <ScanFailIcon 
                                tooltipPlacement="top"
                                scanEndAt={lastScanTask.scanEndAt || lastScanTask.scanStartAt}
                                hasScanSuccessfulRecord={isScanSuccessful}
                            />
                        }
                    </span>
                </td>

                <td>
                    {
                        isScanSuccessful 
                            ? data.scanModeText
                            : <p className="no-data">{i18n.t('dashboard.no-data-found')}</p>
                    }
                </td>

                <td className="p-time">
                    <span>{summary.scanDate}</span>
                    <span>{summary.scanTime || '-'}</span>
                </td>

                <td>
                    {utils.formatNumber(summary.fileCount) || '-'}
                </td>

                <td>
                    {utils.formatNumber(summary.lineCount) || '-'}
                </td>

                <td>
                    {utils.formatNumber(ruleSetSummaryData['criticality'].HIGH) || '-'}
                </td>

                <td>
                    {utils.formatNumber(ruleSetSummaryData['criticality'].MEDIUM) || '-'}
                </td>

                <td>
                    {utils.formatNumber(ruleSetSummaryData['criticality'].LOW) || '-'}
                </td>

                <td className="issue-count">
                    {
                        data.hasDsr && 
                            <TrendIcon 
                                value={allIssueCount} 
                                baselineValue={summary.baselineIssueCount} 
                            />
                    }
                    {utils.formatNumber(ruleSetSummaryData.issuesCount) || '-'}
                </td>

                <td className="action-btn">
                    {
                        isScanSuccessful
                            ? <>
                                {
                                    data.hasDsr && 
                                    <a onClick={(event) => onGotoDsrPage(event, data.id)}>
                                        <Image src={TriangleIcon}/>
                                        <span>{i18n.t('pages.scan-result.right-nav.delta-view')}</span>
                                    </a>
                                }
                            </>
                            : '-'
                    }
                </td>

            </tr>
        );
    });

    const data = [...props.tableData];

    return (<div className="list-view">
        {!isLoading && <SortingTable
            headerData={headerSettings}
            tableData={data}
            renderTable={renderTable}
            currentSorting={sorting}
            tablePaging={tablePaging}
            handlePageChange={handlePageChange}
            handlePageSizeChange={handlePageSizeChange}
            {...props}
        />}
    </div>);
}
