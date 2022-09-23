import React from 'react'
import classNames from 'classnames'
import Meter from 'Components/Meter'
import enums from 'Common/enumeration'
import i18n from 'i18next'

import './meter.scss'
import { Row, Col } from 'react-bootstrap'

export default props => {
	let riskValue, riskName

	switch (props.criticality) {
		case enums.ISSUE_PRIORITY.low:
			riskValue = 30
			riskName = i18n.t('pages.scan-result.LOW')
			break
		case enums.ISSUE_PRIORITY.medium:
			riskValue = 90
			riskName = i18n.t('pages.scan-result.MEDIUM')
			break
		case enums.ISSUE_PRIORITY.high:
			riskValue = 150
			riskName = i18n.t('pages.scan-result.HIGH')
			break
		default:
			riskValue = 0
			break
	}

	return (
		<div className='meter-block-pdf block'>
			<Row noGutters>
				<Col md={8}>
					<div
						className='meterbox__title'
						title={i18n.t(
							'pages.scan-result.pdf.project-summary.project-risk'
						)}>
						{i18n.t('pages.scan-result.pdf.project-summary.project-risk')}
					</div>
				</Col>
				<Col md={4}>
					<h6
						className={classNames('pill', 'justify-content-end', {
							low: props.criticality === enums.ISSUE_PRIORITY.low,
							medium: props.criticality === enums.ISSUE_PRIORITY.medium,
							high: props.criticality === enums.ISSUE_PRIORITY.high,
						})}>
						{riskName}
					</h6>
				</Col>
			</Row>
			<Row noGutters className='justify-content-md-center'>
				<Col md={8} className='justify-content-md-start'>
					<Meter key={riskValue} value={riskValue} rotateDirectly />
				</Col>
			</Row>
		</div>
	)
}
