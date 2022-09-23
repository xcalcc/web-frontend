import React from 'react'
import { Col, Row } from 'react-bootstrap'
import i18n from 'i18next'
import enums from 'Common/enumeration';

const valuePair = data => (
	<Row noGutters>
		<Col
			className='field-name'
			style={data.keyStyle}
			md={data.keyGridCount || 6}>
			{data.key}
		</Col>
		<Col
			className='field-value'
			style={data.valueStyle}
			md={data.ValueGridCount || 6}>
			{data.value}
		</Col>
	</Row>
)

const MetaBlock = props => {
	const { projectSummaryData } = props

	let scanMode = projectSummaryData.scanMode || enums.SCAN_MODE.SINGLE;
	// for SINGLE_XSCA, builtIn page display SINGLE, misra page display XSCA
	if (projectSummaryData.scanMode === enums.SCAN_MODE.SINGLE_XSCA) {
		scanMode = enums.SCAN_MODE.SINGLE;
	}

	return (
		<>
			<Row noGutters>
				<Col md={9}>
					{valuePair({
						key: i18n.t('pages.scan-result.pdf.project-summary.project-name'),
						value: projectSummaryData.projectName,
						keyGridCount: 2,
						ValueGridCount: 10,
					})}
				</Col>
				<Col md={3}>
					{valuePair({
						key: i18n.t('pages.scan-result.pdf.project-summary.report-date'),
						value: projectSummaryData.reportDate,
					})}
				</Col>
			</Row>

			<br />
			<Row noGutters>
				<Col md={3}>
					{valuePair({
						key: i18n.t('pages.scan-result.pdf.project-summary.scan-date'),
						value: projectSummaryData.scanDate,
						keyGridCount: 4,
						ValueGridCount: 8,
					})}
				</Col>
				<Col md={3}>
					{valuePair({
						key: i18n.t('pages.scan-result.pdf.project-summary.total-files'),
						value: projectSummaryData.fileCounts,
						keyGridCount: 5,
						ValueGridCount: 7,
					})}
				</Col>
				<Col md={3}>
					{valuePair({
						key: i18n.t('common.scan-mode.title'),
						value: i18n.t(`common.scan-mode.${scanMode}`),
						valueStyle: {
							textTransform: 'uppercase',
						},
					})}
				</Col>
				<Col md={3}>
					{valuePair({
						key: i18n.t('pages.scan-result.pdf.project-summary.project-owner'),
						value: projectSummaryData.projectOwner,
					})}
				</Col>
			</Row>

			<Row noGutters>
				<Col md={3}>
					{valuePair({
						key: i18n.t('pages.scan-result.pdf.project-summary.scan-time'),
						value: projectSummaryData.scanTime,
						keyGridCount: 4,
						ValueGridCount: 8,
					})}
				</Col>
				<Col md={3}>
					{valuePair({
						key: i18n.t('pages.scan-result.pdf.project-summary.lines-scanned'),
						value: projectSummaryData.lineCounts,
						keyGridCount: 5,
						ValueGridCount: 7,
					})}
				</Col>
				<Col md={3}>
					{valuePair({
						key: i18n.t('pages.scan-result.pdf.project-summary.language'),
						value: projectSummaryData.language,
					})}
				</Col>
			</Row>
		</>
	)
}

export default MetaBlock
