import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Image} from 'react-bootstrap';
import * as actions from 'Actions';
import i18n from 'i18next';
import * as utils from "Utils";
import enums from "Enums";
import TipMessage from 'Components/TipMessage';
import Dropdown from "Components/Dropdown";

import PdfIcon from 'Icons/pdf.svg';
import CsvIcon from 'Icons/csv.svg';
import DownloadArrowIcon from 'Icons/download_arrow.svg';
import './style.scss';
import moment from "moment";
import ExportPdf from "./pdf";

const DownloadReport = props => {
    const {
        isDsrPage,
        scanTaskId,
        projectUuid,
        projectName,
        scanMode,
    } = props;

    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const currentFilter = useSelector(state => state.page.scanResult.filter);
    const appInfo = useSelector(state => state.app.appInfo);

    const downloadOptions = [
        {
            label: i18n.t('pages.scan-result.right-nav.project-summary'),
            value: 'pdf',
            icon: <Image src={PdfIcon}/>
        },
        {
            label: i18n.t('pages.scan-result.right-nav.detailed-report'),
            value: 'csv',
            icon: <Image src={CsvIcon}/>
        }
    ];

    const handleSelected = async data => {
        if (data.value === 'pdf') {
            await handlePdfDownload();
        } else {
            await handleCsvDownload();
        }
    }

    const prepareReportFilter = () => {
        const payload = dispatch(actions.getPayloadOfSearchIssue({
            isDsrPage,
            isMisraPage: false,
            scanTaskId,
            currentFilter,
        }));

        payload.projectId = projectUuid;
        return payload;
    }

    const handleCsvDownload = async () => {
        setIsLoading(true);

        let newPrefix;
        let reportContentType;
        const timezone = new Date().getTimezoneOffset();
        const prefix = timezone === 0 ? '' : timezone.toString().at(0);

        switch (prefix) {
            case '+':
                newPrefix = '-';
                break;
            case '-':
                newPrefix = '+';
                break;
            default:
                newPrefix = '';
                break;
        }

        switch (scanMode) {
            case enums.SCAN_MODE.SINGLE:
                reportContentType = enums.CSV_REPORT_TYPE.SINGLE;
                break;
            case enums.SCAN_MODE.CROSS:
                reportContentType = enums.CSV_REPORT_TYPE.CROSS;
                break;
            case enums.SCAN_MODE.SINGLE_XSCA:
                // builtIn page use SINGLE, misra page use MISRA
                reportContentType = enums.CSV_REPORT_TYPE.SINGLE;
                break;
            case enums.SCAN_MODE.XSCA:
                reportContentType = enums.CSV_REPORT_TYPE.MISRA;
                break;
            default:
                break;
        }

        const response = await dispatch(actions.getDetailReport({
            payload: prepareReportFilter(),
            fileType: 'csv',
            reportType: reportContentType, 
            isDsr: isDsrPage,
            timezoneInMins: newPrefix + Math.abs(timezone)
        }));

        if (response.error) {
            let errorMessage;
            const errorResponse = response.error.response || {};

            if (errorResponse.data instanceof Blob) {
                const data = JSON.parse(await errorResponse.data.text());
                errorMessage = utils.formattingApiMessage(data.localizedMessage, data.unifyErrorCode)
            } else {
                errorMessage = utils.getApiMessage(response.error);
            }

            dispatch(actions.pushAlert({
                type: 'error',
                title: i18n.t('common.notifications.failure'),
                content: errorMessage
            }));
        } else {
            downloadFile(response, "csv");
        }

        setIsLoading(false);
    }

    const generatePDFFileName = projectName => {
        return `${projectName}_xcalscan_report_${moment().format('DD-MM-YYYY')}_${localStorage.getItem('language') === 'en' ? 'en' : 'zh'}.pdf`;
    };

    const handlePdfDownload = async () => {
        setIsLoading(true);
        //{proj name}_xcalscan_summary_{today date}.pdf
        const locale = localStorage.getItem('language');
        const filterConditions = prepareReportFilter();

        const pdfData = await dispatch(actions.getSummaryReport(prepareReportFilter(filterConditions)));
        pdfData.filterConditions = currentFilter;
        console.log(currentFilter)
        const rulesetIdOrStandardId = pdfData.filterConditions.ruleSetId || pdfData.filterConditions.standard;
        if (rulesetIdOrStandardId) {
            const rulesetObj = utils.scanResultHelper.getRuleSetInfoFromRuleSetCode(rulesetIdOrStandardId);
            pdfData.filterConditions = {
                ...pdfData.filterConditions,
                ruleSetAndStandardNames: rulesetObj.displayName || rulesetIdOrStandardId.toUpperCase()

            }
        }

        await ExportPdf({
            fileName: generatePDFFileName(projectName),
            data: pdfData,
            meta: {
                ver: appInfo && appInfo.app && appInfo.app.version,
                userName: utils.localStore.get("displayname")
            }
        }, locale);
        setIsLoading(false);
    }

    const downloadFile = (response, fileType) => {
        const blob = new Blob([response.data], {type: `application/${fileType}`});
        const url = window.URL.createObjectURL(blob);

        let downloadElement = document.createElement("a");
        downloadElement.href = url;

        let headerContent = response.headers['content-disposition'];
        let fileName = `issue_report_${+new Date()}.${fileType}`;

        if (headerContent) {
            const match = headerContent.match(/filename[:=](.+)/);
            if (Array.isArray(match) && match[1]) {
                fileName = match[1].replace(/"/g, '').trim();
            }
        }

        downloadElement.download = fileName;
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
        window.URL.revokeObjectURL(url);
    }

    return <div className="download-report">
        <Dropdown
            label={i18n.t('pages.scan-result.right-nav.download')}
            options={downloadOptions}
            icon={<img src={DownloadArrowIcon}/>}
            onSelect={async data => await handleSelected(data)}
        />
        {isLoading &&
            <TipMessage
                isShowLoading
                message={i18n.t('pages.scan-result.report-download-tip')}
            />
        }
    </div>;
}

export default DownloadReport;