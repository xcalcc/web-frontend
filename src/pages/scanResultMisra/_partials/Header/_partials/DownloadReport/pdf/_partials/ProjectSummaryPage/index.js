import { Col, Container, Row } from 'react-bootstrap';
import i18n from 'i18next';
import React from 'react';
import moment from 'moment';
import * as utils from 'Utils';

import MetaBlock from './_metaBlock';
import TotalDefectsBlock from './_totalDefects';
import SeverityBlock from './_severityBlock';
import FilterCondition from './_filterConditions';
import DefectsByRiskLevelTableBlock from './_defectsByRiskLevelTable';
import AssignmentsBlock from './_assignmentsBlock';

import './style.scss';

const extractProjectSummaryData = data => {
	return {
		projectName: data.projectName,
		reportDate: moment(data.reportDate).format('DD/MM/YYYY'),
		scanDate: moment(data.scanDate).format('DD/MM/YYYY'),
		scanTime: moment(data.scanTime).format('HH:mm:ss'),
		scanMode: data.scanMode,
		fileCounts: utils.formatNumber(data.fileCounts),
		lineCounts: utils.formatNumber(data.lineCounts),
		language: data.language,
		projectOwner: data.projectOwner,
		criticality: data.projectCriticality,
		defectsCount: data.defectsCount,
		previousDefectsCount: data.previousDefectsCount,
		issueCountGroupByCriticality: data.issueCountGroupByCriticality,
		defectsAssigned: data.defectsAssigned,
		groupByCriticalityCertainty: data.groupByCriticalityCertainty,
	}
}

const ProjectSummaryPage = props => {
	const { data, locale } = props

	const filterConditions = data.filterConditions;
	const projectSummaryData = extractProjectSummaryData(data)

	const title = (
		<div className='title'>
			{i18n.t('pages.scan-result.pdf.project-summary.project-summary-report')}
		</div>
	)
	const metaInfo = <MetaBlock projectSummaryData={projectSummaryData} />

	const totalIssues = Number(projectSummaryData.defectsCount)
	const charts = (
		<Row noGutters className='charts'>
			<Col className='defect-total block' md={2}>
				<TotalDefectsBlock
					totalDefects={totalIssues}
					previousTotalDefects={projectSummaryData.previousDefectsCount}
				/>
			</Col>
			<Col className={`${locale} risk-chart block`} md={8}>
				<SeverityBlock
					riskDataMap={{
						high: 0,
						medium: 0,
						low: 0,
						...projectSummaryData.issueCountGroupByCriticality,
					}}
					totalIssues={totalIssues}
				/>
			</Col>
			<Col className='assigned-defects block' md={2}>
				<AssignmentsBlock
					assigned={projectSummaryData.defectsAssigned && projectSummaryData.defectsAssigned.count}
					assignedPercentage={projectSummaryData.defectsAssigned && projectSummaryData.defectsAssigned.percentage}
				/>
			</Col>
		</Row>
	)

	return (
		<Container
			fluid
			className={`${locale} project-summary-page`}>
			{title}
			<br />
			{metaInfo}
			<br />
			{
				((filterConditions.ruleCodes && filterConditions.ruleCodes.length) ||  filterConditions.searchValue) && 
				<FilterCondition
					keyword={filterConditions.searchValue}
					filteredRules={Array.isArray(filterConditions.ruleCodes) && filterConditions.ruleCodes.filter(rule => !['all-H', 'all-M', 'all-L'].includes(rule.id)).map(rule => rule.label)}
				/>
			}

			<hr />
			{charts}
			<hr />

			<DefectsByRiskLevelTableBlock
				locale={locale} criticalityGroups={projectSummaryData.groupByCriticalityCertainty}
			/>
		</Container>
	)
}

export default ProjectSummaryPage
