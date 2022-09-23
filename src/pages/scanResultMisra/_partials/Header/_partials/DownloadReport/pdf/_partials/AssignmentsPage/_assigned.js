import React from 'react'
import i18n from 'i18next'
import { Row, Col, Container } from 'react-bootstrap'
import AssignedIcon from 'Assets/images/icons/pdf_assigned.svg'

import './assigned-block.scss'

const extractViewModel = data => {
	return {
		count: data ? data.count : 0,
		assignedByUser: data ? data.assignedByUser : [],
	}
}
const RiskBlock = props => {
	const { riskTitle, data, titleClass } = props

	return (
		<div className='risk-breakdown'>
			<div className={`block-title ${titleClass}`}>
				<span className='block-title__dot'>&bull;</span>
				<span className='block-title__text'>
					{riskTitle}
				</span>
			</div>
			{Object.keys(data).map((code, idx) => {
				return (
					<Row noGutters key={idx} className='data-row'>
						<Col md={6} className='data-row_code'>
							{code}
						</Col>
						<Col md={6} className='data-row_counts'>
							{data[code]}
						</Col>
					</Row>
				)
			})}
		</div>
	)
}
const AssigneeBlock = props => {
	const { assignee } = props
	const user = assignee.user
	const breakDownByCriticalityAndCsvCode =
		assignee.breakDownByCriticalityAndCsvCode

	return (
		<div className='assigned-block'>
			<Row noGutters>
				<Col md={6}>
					<div className='assigned-block__info-wrapper'>
						<div className='assigned-block__avatar'>
							<img src={AssignedIcon} />
						</div>
						<div className='assigned-block__info'>
							<div className='name'>{user.name}</div>
							<div className='issue-counts'>{assignee.counts}</div>
						</div>
					</div>
				</Col>
				<Col md={6}>
					<Container style={{ paddingLeft: 0, paddingRight: 0 }} fluid>
						{Object.keys(breakDownByCriticalityAndCsvCode).map((risk, idx) => {
							const riskCode = risk.toLowerCase()
							if (!Object.keys(breakDownByCriticalityAndCsvCode[risk]).length) {
								return null
							}
							return (
								<RiskBlock
									key={idx}
									titleClass={riskCode}
									riskTitle={i18n.t(`pages.scan-result.pdf.table.${riskCode}`)}
									data={breakDownByCriticalityAndCsvCode[risk]}
								/>
							)
						})}
					</Container>
				</Col>
			</Row>
		</div>
	)
}

const AssignedBlock = props => {
	const { data, locale } = props
	const assignedData = extractViewModel(data)
	return (
		<div className={`${locale} assigned-block`}>
			<div className='block-title'>
				{i18n.t('pages.scan-result.pdf.assignments.assigned')}
			</div>
			<div className='total-counts'>
				<img src={AssignedIcon} className='total-counts__icon' />
				<span className='total-counts__number'>{assignedData.count}</span>
			</div>
			<div className='assigned-block__list'>
				{assignedData.assignedByUser &&
					assignedData.assignedByUser.map((assigneeData, idx) => (
						<AssigneeBlock key={idx} assignee={assigneeData} />
					))}
			</div>
		</div>
	)
}

export default AssignedBlock
