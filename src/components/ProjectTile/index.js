import React, {useState, useEffect, useMemo} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Container, Image} from 'react-bootstrap';
import * as utils from 'Utils';
import enums from 'Common/enumeration';
import i18n from 'i18next';
import TrendIcon from 'Components/TrendIcon';
import Skeleton from 'Components/SkeletonHolder';
import ScanMode from './ScanMode';
import ScanningIcon from './ScanningIcon';
import ScanFailIcon from 'Containers/ScanFailIcon';

import './project-tile.scss';

import projectIcon from 'Assets/images/icon/project-icon.png';
import SettingIcon from 'Icons/settings.svg';
import DeleteIcon from 'Icons/close-circle.svg';
import TriangleIcon from 'Icons/triangle.svg';

const ProjectTile = props => {
    const {
        data,
        onViewScanRecord,
        onViewSetting,
        onDeleteProject,
        onProjectClick,
        onGotoDsrPage,
    } = props;
    const [isMouseOver, setMouseOver] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSelectedMisra, setIsSelectedMisra] = useState(false);
    const summary = data.summary || {};
    const baselineRuleSetCount = summary.baselineRuleSetCount || {};
    const ruleSetSummaryMap = summary.ruleSetSummaryMap || {};
    const lastScanTask = data.lastScanTask || {};

    const allData = ruleSetSummaryMap[enums.RULE_SET.ALL] || {};
    const allCriticality = allData['criticality'] || {};

    let misraBaselineIssueCount = 0;
    let misraIssueCount = 0;
    let misraCriticality = {
        HIGH: 0,
        MEDIUM: 0,
        LOW: 0
    };

    enums.MISRA_RULE_SETS.forEach(ruleSetCode => {
        const summaryMap = ruleSetSummaryMap[ruleSetCode] || {};
        const criticality = summaryMap['criticality'] || {};

        misraIssueCount += Number(summaryMap.issuesCount) || 0;
        misraCriticality.HIGH += Number(criticality.HIGH) || 0;
        misraCriticality.MEDIUM += Number(criticality.MEDIUM) || 0;
        misraCriticality.LOW += Number(criticality.LOW) || 0;
        misraBaselineIssueCount += Number(baselineRuleSetCount[ruleSetCode]) || 0;
    });

    const isScanSuccessful = utils.isNumber(allData.issuesCount);

    let issueCountData = {};

    if(isScanSuccessful) {
        if(data.scanMode === enums.SCAN_MODE.XSCA || isSelectedMisra) {
            issueCountData = {
                HIGH: misraCriticality.HIGH,
                MEDIUM: misraCriticality.MEDIUM,
                LOW: misraCriticality.LOW,
                total: misraIssueCount,
                baselineIssueCount: misraBaselineIssueCount
            };
        } else {
            issueCountData = {
                HIGH: (allCriticality.HIGH || 0) - misraCriticality.HIGH,
                MEDIUM: (allCriticality.MEDIUM || 0) - misraCriticality.MEDIUM,
                LOW: (allCriticality.LOW || 0) - misraCriticality.LOW,
                total: allData.issuesCount - misraIssueCount,
                baselineIssueCount: (baselineRuleSetCount[enums.RULE_SET.ALL] || 0) - misraBaselineIssueCount
            };
        }
    }

    const isLastScanFailed = useMemo(() => {
        return lastScanTask.status === enums.SCAN_TASK_STATUS.failed
            || lastScanTask.status === enums.SCAN_TASK_STATUS.terminated
            || data.scanningStatus === enums.NOTIFICATION_TASK_STATUS.FAILED
            || data.scanningStatus === enums.NOTIFICATION_TASK_STATUS.FATAL;
    }, [data.scanningStatus, lastScanTask.status]);

    const mouseOver = () => setMouseOver(true);
    const mouseOut = () => setMouseOver(false);

    const onSwitchScanMode = (isSelectedMisra) => {
        setIsSelectedMisra(isSelectedMisra);
    }

    useEffect(() => {
        if (summary.finishLoading) {
            setIsLoading(false);
        }
    }, [summary.finishLoading]);

    useEffect(() => {
        const baselineAllIssueCount = Object.values(baselineRuleSetCount).reduce((total, curr) => total + Number(curr), 0);
        baselineRuleSetCount[enums.RULE_SET.ALL] = baselineAllIssueCount;
    }, [baselineRuleSetCount]);

    return (
        <Container
            key={data.id}
            className={classNames('project-tile', 'icon-box', {
                'show': isScanSuccessful && isMouseOver && !isLoading,
                'disable': !isScanSuccessful
            })}
            onMouseOver={mouseOver}
            onMouseOut={mouseOut}
            onClick={(event) => {
                event.stopPropagation();
                if (isLoading) {
                    return;
                }
                onProjectClick(event, data.id, isSelectedMisra);
            }}
        >
            {
                utils.isEnableDevModeOption(enums.DEV_MODE_OPTION.viewScanHistoryRecord) &&
                <a
                    onClick={(event) => onViewScanRecord(event, data.id)}
                    className="history"
                >
                    <img src={projectIcon}/>
                </a>
            }
            <div className="icon-bg">
                <div className="close_setting">
                    {
                        !isLoading && <a
                            className="dashboard_setting"
                            title={utils.language("setting")}
                            onClick={(event) => onViewSetting(event, data.id)}
                        >
                            <Image src={SettingIcon} alt={utils.language("setting")}/>
                        </a>
                    }
                    {
                        !isLoading && <a
                            className="trash"
                            title={utils.language("delete_project")}
                            onClick={(event) => onDeleteProject(event, data.id)}
                        >
                            <Image src={DeleteIcon} alt={utils.language("delete_project")}/>
                        </a>
                    }
                </div>
                <div className="project-inner-box row-box">
                    <div className="project-title">{data.name}</div>
                    <ul>
                        <li>
                            <span className="scan-mode-row">
                                <span className="scan-mode-text">
                                    {
                                        (!isScanSuccessful && isLastScanFailed)
                                            ? i18n.t('dashboard.fail-scan')
                                            : data.scanModeText
                                    }
                                </span>
                                {
                                    isScanSuccessful && 
                                    <ScanMode 
                                        scanMode={data.scanMode}
                                        onSwitchScanMode={onSwitchScanMode}
                                    />
                                }
                                {
                                    data.isScanning && <ScanningIcon />
                                }
                                {
                                    isLastScanFailed && 
                                    <ScanFailIcon 
                                        tooltipPlacement="bottom"
                                        scanEndAt={lastScanTask.scanEndAt || lastScanTask.scanStartAt}
                                        hasScanSuccessfulRecord={isScanSuccessful}
                                    />
                                }
                            </span>
                            {
                                isLoading ? <Skeleton/> : (
                                    <div className="scan-time">
                                        <strong>{summary.scanDate || '-'}</strong>
                                        <strong>{summary.scanTime || '-'}</strong>
                                    </div>
                                )
                            }
                        </li>
                    </ul>
                    <ul className="file_line_dashboard_box d-flex">
                        <li>
                            <span>{utils.language("lines_qty")}</span>
                            {
                                isLoading ? <Skeleton/> :
                                    <strong>{(summary && utils.formatNumber(summary.lineCount)) || '-'}</strong>
                            }
                        </li>
                        <li>
                            <span>{utils.language("files_qty")}</span>
                            {
                                isLoading ? <Skeleton/> :
                                    <strong>{(summary && utils.formatNumber(summary.fileCount)) || '-'}</strong>
                            }
                        </li>
                    </ul>
                    <div className="risk-list">
                        <p className="risk-title">
                            {
                                (data.scanMode === enums.SCAN_MODE.XSCA || isSelectedMisra)
                                    ? i18n.t('dashboard.obligation-level')
                                    : i18n.t('dashboard.risk-level')
                            }
                        </p>
                        <div className="d-flex justify-content-between">
                            <div className="risk-block red">
                                <div className="risk-count">
                                    {isLoading ?
                                        <Skeleton/> : utils.formatNumber(issueCountData.HIGH) || '-'}
                                </div>
                            </div>
                            <div className="risk-block orange">
                                <div className="risk-count">
                                    {isLoading ?
                                        <Skeleton/> : utils.formatNumber(issueCountData.MEDIUM) || '-'}
                                </div>
                            </div>
                            <div className="risk-block blue">
                                <div className="risk-count">
                                    {isLoading ?
                                        <Skeleton/> : utils.formatNumber(issueCountData.LOW) || '-'}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="total-row">
                        {
                            isLoading 
                                ? <Skeleton/>
                                : <>
                                    <span className="total-value">
                                        {
                                            data.hasDsr && 
                                            <TrendIcon 
                                                value={issueCountData.total} 
                                                baselineValue={issueCountData.baselineIssueCount}
                                            />
                                        }
                                        {
                                            isScanSuccessful 
                                                ? utils.formatNumber(issueCountData.total)
                                                : <p className="no-data">{i18n.t('dashboard.no-data-found')}</p>
                                        }
                                    </span>
                                    {
                                        (isScanSuccessful && props.hasDsr) && 
                                        <a className="link-dsr" onClick={(event) => onGotoDsrPage(event, data.id, isSelectedMisra)}>
                                            <Image src={TriangleIcon}/>
                                            <span>{i18n.t('pages.scan-result.right-nav.delta-view')}</span>
                                        </a>
                                    }
                                </>
                        }
                    </div>
                </div>
            </div>
        </Container>
    );
}

ProjectTile.propsTypes = {
    data: PropTypes.object.isRequired,
}
ProjectTile.defaultProps = {
    data: {}
}

export default ProjectTile;
