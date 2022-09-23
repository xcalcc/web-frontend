import React from 'react'
import i18n from 'i18next'
import enums from 'Enums'
import classNames from 'classnames'
import PDFTable from '../Table'
import * as utils from 'Utils'
import PersonIcon from 'Assets/images/icons/pdf_person.svg'

import './unassigned-block.scss'

const extractViewModel = data => {
	return {
		count: data ? data.count : 0,
		groupByCriticalityCertainty: data ? data.groupByCriticalityCertainty : {},
	}
}

const UnassignedBlock = props => {
	const { locale, data } = props

	const unassignedData = extractViewModel(data)

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
	const headRows = [
		{ field: 'defect-risk', label: '', className: 'table-header' },
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
	]

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
							<span>{misraCodeShort || '-'}</span>
						</td>
						<td>{ruleInfo.name}</td>
					</tr>
				)
			})
		)
	}

	let rows = [];

	if (unassignedData.count) {
		rows = [
			...generateTableRows(
				unassignedData.groupByCriticalityCertainty['highD'],
				'high',
				true
			),
			...generateTableRows(
				unassignedData.groupByCriticalityCertainty['highM'],
				'high'
			),
			...generateTableRows(
				unassignedData.groupByCriticalityCertainty['mediumD'],
				'medium',
				true
			),
			...generateTableRows(
				unassignedData.groupByCriticalityCertainty['mediumM'],
				'medium'
			),
			...generateTableRows(
				unassignedData.groupByCriticalityCertainty['lowD'],
				'low',
				true
			),
			...generateTableRows(
				unassignedData.groupByCriticalityCertainty['lowM'],
				'low'
			),
		]
	}

	return (
		<div className={`${locale} unassigned-block`}>
			<div className='block-title'>
				{i18n.t('pages.scan-result.pdf.assignments.unassigned')}
			</div>
			<div className='total-counts'>
				<img src={PersonIcon} className='total-counts__icon' />
				<span className='total-counts__number'>{unassignedData.count}</span>
			</div>
			<PDFTable id='unassigned-table' headers={headRows}>
				<tbody className='scroll'>{rows}</tbody>
			</PDFTable>
		</div>
	)
}

export default UnassignedBlock
