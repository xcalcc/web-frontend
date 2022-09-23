import React from 'react';
import {useSelector} from "react-redux";
import i18n from 'i18next';
import moment from 'moment';
import Enums from 'Enums';
import * as utils from 'Utils';
import ScanFailIcon from 'Containers/ScanFailIcon';
import ScanModeComponent from './ScanMode';

import './style.scss';

const MetasBlock = props => {
    const {
        scanMode,
        currentProjectSummary
    } = props;

    const dateFormat = utils.isChinese() ? 'YYYY/MM/DD' : 'DD/MM/YYYY';
    const currentScanSummary = useSelector(state => state.scan.currentScanSummary);
    const latestScanTask = (currentScanSummary && currentScanSummary.latestScanTask) || {};

    const isLastScanFailed = [Enums.SCAN_TASK_STATUS.failed, Enums.SCAN_TASK_STATUS.terminated].includes(latestScanTask.status);

    const metasData = {
        date: moment(currentProjectSummary.scanEndAt).format(dateFormat),
        time: moment(currentProjectSummary.scanEndAt).format('HH:mm:ss'),
        fileCount: utils.formatNumber(currentProjectSummary.fileCount),
        lineCount: utils.formatNumber(currentProjectSummary.lineCount),
    };

    return <div className="scan-result-metas">
        <div className="scan-mode-wrap">
            <ScanModeComponent
                scanMode={scanMode}
            />
            <div className="title-suffix">
                {
                    isLastScanFailed && 
                    <ScanFailIcon 
                        tooltipPlacement="top"
                        scanEndAt={latestScanTask.scanEndAt || latestScanTask.scanStartAt}
                        hasScanSuccessfulRecord={true}
                    />
                }
            </div>
        </div>
        <div className="meta-wrap">
            <div className="meta-column">
                <p>
                    <strong>{i18n.t('pages.scan-result.scan-time')}</strong>
                    <span>{metasData.time}</span>
                </p>
                <p>
                    <strong>{i18n.t('pages.scan-result.scan-date')}</strong>
                    <span>{metasData.date}</span>
                </p>
            </div>
            <div className="meta-column">
                <p>
                    <strong>{i18n.t('pages.scan-result.files')}</strong>
                    <span>{metasData.fileCount}</span>
                </p>
                <p>
                    <strong>{i18n.t('pages.scan-result.lines')}</strong>
                    <span>{metasData.lineCount}</span>
                </p>
            </div>
        </div>
    </div>
}

export default MetasBlock;