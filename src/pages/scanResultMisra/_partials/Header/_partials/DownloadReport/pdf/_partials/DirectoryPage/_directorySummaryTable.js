import React from 'react';
import * as utils from 'Utils';
import i18n from "i18next";
import PDFTable from "../Table";

import './directory-table.scss';

const DirectorySummaryTable = props => {
    const { locale, tableData } = props

    function getRiskTableHeader (label, severity) {
        return <div className="table-header">
            <div className={`risk-dot ${severity}`}>&nbsp;</div>
            <span className='risk-text'>{label}</span>
        </div>
    }

    const headRows = [
        {field: 'file', label: i18n.t('pages.scan-result.pdf.table.file'), className: 'table-header'},
        {field: 'defect-found', label: i18n.t('pages.scan-result.pdf.table.defects-found'), className: 'table-header'},
        {field: 'defect-type', label: i18n.t('pages.scan-result.pdf.table.percentage'), className: 'table-header'},
        {field: 'risk-high', label: getRiskTableHeader(i18n.t('pages.scan-result.pdf.table.MANDATORY'), 'high'), className: 'table-header risk-high'},
        {field: 'risk-medium', label: getRiskTableHeader(i18n.t('pages.scan-result.pdf.table.REQUIRED'), 'medium'), className: 'table-header risk-medium'},
        {field: 'risk-low', label: getRiskTableHeader(i18n.t('pages.scan-result.pdf.table.ADVISORY'), 'low'), className: 'table-header risk-low'},
    ];
				
    return <div className={`${locale} directory-summary-table-pdf-misra`}>
        <div className="table-title">{i18n.t('pages.scan-result.pdf.directory.defects-by-directory')}</div>
        <PDFTable
            id="directory-summary-table"
            headers={headRows}
        >
            <tbody className="scroll">
            {tableData && tableData.map((item, index) => (
                <tr
                    key={index}
                >
                    <td>
                        <span>{item.path}</span>
                    </td>
                    <td>
                        <span>{utils.formatNumber(item.counts)}</span>
                    </td>
                    <td>
                        <span>{utils.formatPercentage(Number(item.percentage)).string}</span>
                    </td>
                    <td>
                        {utils.formatNumber(item.criticalityBreakDown.high)}
                    </td>
                    <td>
                        {utils.formatNumber(item.criticalityBreakDown.medium)}
                    </td>
                    <td>
                        {utils.formatNumber(item.criticalityBreakDown.low)}
                    </td>
                </tr>
            ))}
            </tbody>
        </PDFTable>
    </div>;
}

export default DirectorySummaryTable;
