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

    let downloadOptions = [
        {
            label: i18n.t('pages.scan-result.right-nav.project-summary'),
            value: 'pdf',
            icon: <Image src={PdfIcon}/>
        },
        {
            label: i18n.t('pages.scan-result.right-nav.detailed-report'),
            value: 'csv',
            icon: <Image src={CsvIcon}/>
        },
    ];

    if(utils.isEnableDevModeOption(enums.DEV_MODE_OPTION.validation)) {
        downloadOptions = downloadOptions.concat([
            {
                divider: true
            },
            {
                label: i18n.t('pages.scan-result.right-nav.project-summary-include-ignore'),
                value: 'pdf-include-ignore',
                icon: <Image src={PdfIcon}/>
            },
            {
                label: i18n.t('pages.scan-result.right-nav.detailed-report-include-ignore'),
                value: 'csv-include-ignore',
                icon: <Image src={CsvIcon}/>
            }
        ]);
    }

    const handleSelected = async data => {
        switch(data.value) {
            case 'pdf':
                await handlePdfDownload(false);
                break;
            case 'csv':
                await handleCsvDownload(false);
                break;
            case 'pdf-include-ignore':
                await handlePdfDownload(true);
                break;
            case 'csv-include-ignore':
                await handleCsvDownload(true);
                break;
            default:
                break;
        }
    }

    const prepareReportFilter = (isIncludeIgnore) => {
        const payload = dispatch(actions.getPayloadOfSearchIssue({
            isDsrPage,
            isMisraPage: true,
            scanTaskId,
            currentFilter,
            validationFilterType: isIncludeIgnore 
                ? enums.VALIDATION_FILTER_TYPE.ALL
                : enums.VALIDATION_FILTER_TYPE.NON_IGNORE
        }));

        payload.projectId = projectUuid;
        return payload;
    }

    const handleCsvDownload = async (isIncludeIgnore) => {
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
                reportContentType = enums.CSV_REPORT_TYPE.MISRA;
                break;
            case enums.SCAN_MODE.XSCA:
                reportContentType = enums.CSV_REPORT_TYPE.MISRA;
                break;
            default:
                break;
        }

        const response = await dispatch(actions.getDetailReport({
            payload: prepareReportFilter(isIncludeIgnore),
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
        return `${projectName}_xcalscan_report_msr_${moment().format('DD-MM-YYYY')}_${localStorage.getItem('language') === 'en' ? 'en' : 'zh'}.pdf`;
    };

    const handlePdfDownload = async (isIncludeIgnore) => {
        setIsLoading(true);
        //{proj name}_xcalscan_summary_{today date}.pdf
        const locale = localStorage.getItem('language');
        const filterConditions = prepareReportFilter(isIncludeIgnore);
        let pdfData = await dispatch(actions.getSummaryReport(filterConditions));
        pdfData.filterConditions = currentFilter;

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