import React from 'react'
import i18n from 'i18next'
import classNames from 'classnames'
import enums from 'Enums'
import * as utils from 'Utils'
import PDFTable from '../Table'

import './defects-by-risk-level-table.scss'

const DefectsByRiskLevelTable = props => {
    const {locale, criticalityGroups} = props

    const headRows = [
        {field: 'defect-risk', label: '', className: 'table-header'},
        {
            field: 'defect-found',
            label: i18n.t('pages.scan-result.pdf.table.defects-found'),
            className: 'table-header',
        },
        {
            field: 'defect-type',
            label: i18n.t('pages.scan-result.pdf.table.type'),
            className: 'table-header',
        },
        {
            field: 'rule-description',
            label: i18n.t('pages.scan-result.pdf.table.description'),
            className: 'table-header',
        },
        {
            field: 'percentage',
            label: i18n.t('pages.scan-result.pdf.table.percentage'),
            className: 'table-header',
        },
    ]
    const getFirstColumn = (criticality, isCertain) => {
        return (
            <div
                className={classNames('label-flag', {
                    high: criticality === enums.ISSUE_CRITICALITY.high.toLowerCase(),
                    medium: criticality === enums.ISSUE_CRITICALITY.medium.toLowerCase(),
                    low: criticality === enums.ISSUE_CRITICALITY.low.toLowerCase(),
                    certainty: isCertain,
                })}>
                &nbsp;
            </div>
        )
    }

    const generateTableRows = (summaryByCsvCode, criticality, isCertain) => {
        return (
            summaryByCsvCode &&
            Object.keys(summaryByCsvCode).map((csvCode, index) => {
                const item = summaryByCsvCode[csvCode];
                const ruleInfo = utils.scanResultHelper.getRuleInfo(csvCode);
                let misraCodeShort;
                if(!ruleInfo.code) {
                    console.error(`Rule info not found for [${csvCode}]`);
                    misraCodeShort = csvCode;
                } else {
                    misraCodeShort = ruleInfo.code; // && ruleInfo.code.replace(/msr_/i, ''); //no replacement for msr
                }

                return (
                    <tr key={index}>
                        <td>{getFirstColumn(criticality, isCertain)}</td>
                        <td>
                            <span>{item.count}</span>
                        </td>
                        <td>
                            <span>{misraCodeShort}</span>
                        </td>
                        <td>{ruleInfo.name || "-"}</td>
                        <td className='percent'>
                            <span>{utils.formatPercentage(item.percentage).string}</span>
                        </td>
                    </tr>
                )
            })
        )
    }
    let rows = [];
    if (criticalityGroups) {
        rows = [
            ...generateTableRows(criticalityGroups['highD'], 'high', true),
            ...generateTableRows(criticalityGroups['highM'], 'high'),
            ...generateTableRows(criticalityGroups['mediumD'], 'medium', true),
            ...generateTableRows(criticalityGroups['mediumM'], 'medium'),
            ...generateTableRows(criticalityGroups['lowD'], 'low', true),
            ...generateTableRows(criticalityGroups['lowM'], 'low'),
        ];
    }

    return (
        <div className={`${locale} defects-summary-table-pdf-misra`}>
            <div className='table-title'>
                {i18n.t('pages.scan-result.pdf.project-summary.defects-by-risk-level-misra')}
            </div>
            <PDFTable id='defects-summary-table' headers={headRows}>
                <tbody className='scroll'>{rows}</tbody>
            </PDFTable>
        </div>
    )
}

export default DefectsByRiskLevelTable
