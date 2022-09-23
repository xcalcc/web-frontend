import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import classNames from 'classnames';
import i18n from 'i18next';
import PropTypes from 'prop-types';
import moment from 'moment';
import Scrollbar from 'react-scrollbars-custom';
import {useHistory, useRouteMatch} from 'react-router-dom';
import enums from 'Enums';
import * as utils from 'Utils';
import TooltipWrapper from 'Components/TooltipWrapper';
import CopyIcon from 'Components/CopyIcon';

import './style.scss';

const LogTable = props => {
    const {
        isMisraPage,
        scanLog,
        projectKey,
        isExistFilter,
        onScrollStop
    } = props;

    const history = useHistory();
    const routeMatch = useRouteMatch();

    const currentScanTaskId = routeMatch.params.scanTaskId;
    const dateFormat = utils.isEnglish() ? 'DD/MM/YYYY' : 'YYYY/MM/DD';

    const onSelectCommit = scanTaskId => {
        if(scanLog.data && scanLog.data.length === 1) return;
        if(isMisraPage) {
            history.push(`/misra/project/${projectKey}/scan/${scanTaskId}`);
        } else {
            history.push(`/project/${projectKey}/scan/${scanTaskId}`);
        }
    }

    const repoActionText = action => {
        let text;
        switch(action) {
            case enums.REPO_ACTION.CI:
                text = i18n.t(`pages.dsr.repo-action-${enums.REPO_ACTION.CI}`);
                break;
            case enums.REPO_ACTION.CD:
                text = i18n.t(`pages.dsr.repo-action-${enums.REPO_ACTION.CD}`);
                break;
            default:
                text = '-';
                break;
        }
        return text;
    }

    return <Container className="log-table noPadding" fluid>
        <Row noGutters className='header'>
            <Col xs={1} className="action">{i18n.t('pages.dsr.repo-action')}</Col>
            <Col xs={1} className="build">{i18n.t('pages.dsr.build-info')}</Col>
            <Col xs={2} className="date">{i18n.t('pages.dsr.date')}</Col>
            <Col xs={1} className="time">{i18n.t('pages.dsr.time')}</Col>
            <Col xs={1} className="duration">{i18n.t('pages.dsr.duration')}</Col>
            <Col xs={2} className="commit-id">{i18n.t('pages.dsr.commit-id')}</Col>
            <Col xs={2} className="compared-commit-id">{i18n.t('pages.dsr.baseline-id')}</Col>
            <Col xs={1} className="new-count">{i18n.t('pages.dsr.new-counts')}</Col>
            <Col xs={1} className="fixed-count">{i18n.t('pages.dsr.fixed-counts')}</Col>
        </Row>

        <Scrollbar 
            noScrollX
            className="item-list" 
            onScrollStop={onScrollStop}
        >
            {
                scanLog.data && scanLog.data.map((rowData, idx) => {
                    let buildInfoStart = '-';
                    let buildInfoEnd = '';
                    let buildInfoTooltip = '';
                    if(rowData.buildInfo) {
                        buildInfoStart = rowData.buildInfo.substring(0, rowData.buildInfo.length - 5);
                        buildInfoEnd = rowData.buildInfo.substring(rowData.buildInfo.length - 5);
                        buildInfoTooltip = rowData.buildInfo.length > 10 ? rowData.buildInfo : '';
                    }

                    return <Row 
                        noGutters 
                        key={idx}
                        className={
                            classNames({
                                active: currentScanTaskId === rowData.scanTaskId || (idx === 0 && !currentScanTaskId && !isExistFilter),
                            })
                        }
                        onClick={() => onSelectCommit(rowData.scanTaskId)}
                    >
                        <Col xs={1} className="action">{repoActionText(rowData.repoAction)}</Col>
                        <Col xs={1} className="build">
                            <TooltipWrapper
                                tooltipText={buildInfoTooltip}
                                options={
                                    {
                                        placement: 'top',
                                    }
                                }
                            >
                                <div className="build-wrap">
                                    <span className="build-start">{buildInfoStart}</span>
                                    <span className="build-end">{buildInfoEnd}</span>
                                </div>
                            </TooltipWrapper>
                        </Col>
                        <Col xs={2} className="date">{moment(rowData.scanEndAt).format(dateFormat)}</Col>
                        <Col xs={1} className="time">{moment(rowData.scanEndAt).format('HH:mm:ss')}</Col>
                        <Col xs={1} className="duration">{utils.millisecondToTime(rowData.scanEndAt-rowData.scanStartAt)}</Col>
                        <Col xs={2} className="commit-id">
                            {String(rowData.commitId).substring(0, 8)}
                            {rowData.commitId && <CopyIcon copyText={rowData.commitId}/>}
                        </Col>
                        <Col xs={2} className="compared-commit-id">
                            {String(rowData.baselineCommitId).substring(0, 8)}
                            {rowData.baselineCommitId && <CopyIcon copyText={rowData.baselineCommitId}/>}
                        </Col>
                        <Col xs={1} className="new-count">{rowData.newCount}</Col>
                        <Col xs={1} className="fixed-count">{rowData.fixedCount}</Col>
                    </Row>
                })
            }
            {
                scanLog.data && scanLog.data.length === 0 &&
                <Container className="no-result-found">
                    {i18n.t('pages.dsr.no-scan-log-found')}
                </Container>
            }
        </Scrollbar>
    </Container>;
}

LogTable.propType = {
    scanLog: PropTypes.arrayOf(PropTypes.shape({
        date: PropTypes.string,
        time: PropTypes.string,
        commitId: PropTypes.string,
        new: PropTypes.number,
        fixed: PropTypes.number,
    })),
}

export default LogTable;
