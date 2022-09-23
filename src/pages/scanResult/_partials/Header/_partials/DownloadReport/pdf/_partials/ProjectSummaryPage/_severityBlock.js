import React from 'react'
import { Container, Col, Row } from 'react-bootstrap'
import enums from 'Enums'
import * as utils from 'Utils'

import './severity-block.scss'
import i18n from 'i18next'

const RiskData = props => {
	const { risk, counts, percentage } = props

	const numberPercentage = percentage && percentage.slice(0, -1)

	return (
		<div className='risk-data'>
			<div className='risk-percentage'>
				{numberPercentage}
				<span>%</span>
			</div>
			<div className='risk-label'>
				<span className={`risk-dot ${risk}`}>&nbsp;</span>
				<span className='risk-counts'>
					{`${i18n.t(
						`pages.scan-result.pdf.table.${risk}`
					)}: ${utils.formatNumber(counts)}`}
				</span>
			</div>
		</div>
	)
}

const SeverityBlock = props => {
	const { totalIssues, riskDataMap } = props

	const highIssues =
		Number(riskDataMap[enums.ISSUE_CRITICALITY.high.toLowerCase()]) || 0
	const mediumIssues =
		Number(riskDataMap[enums.ISSUE_CRITICALITY.medium.toLowerCase()]) || 0
	const lowIssues =
		Number(riskDataMap[enums.ISSUE_CRITICALITY.low.toLowerCase()]) || 0
	const total = totalIssues || highIssues + mediumIssues + lowIssues

	let highPercentage = 0,
		mediumPercentage = 0,
		lowPercentage = 0

	if (totalIssues > 0) {
		highPercentage = (highIssues / total) * 100
		mediumPercentage = (mediumIssues / total) * 100

		highPercentage = utils.formatPercentage(highPercentage)
		mediumPercentage = utils.formatPercentage(mediumPercentage)
		lowPercentage = utils.formatPercentage(
			100 - highPercentage.num - mediumPercentage.num
		)

		if (
			highPercentage.num === 100 ||
			mediumPercentage.num === 100 ||
			lowIssues === 0
		) {
			lowPercentage = utils.formatPercentage(0)
		}
	} else {
		highPercentage = utils.formatPercentage(highPercentage);
		mediumPercentage = utils.formatPercentage(mediumPercentage);
		lowPercentage = utils.formatPercentage(lowPercentage);
	}

	return (
		<Container fluid className='risk-severity-block-pdf block'>
			<Row noGutters>
				<Col>
					<h6>{i18n.t('pages.scan-result.pdf.project-summary.risk')}</h6>
				</Col>
			</Row>
			<Row noGutters>
				<Col md={4} className='align-content-end'>
					<RiskData
						risk={'high'}
						percentage={highPercentage.string}
						counts={highIssues}
					/>
				</Col>
				<Col md={4} className='align-content-end'>
					<RiskData
						risk={'medium'}
						percentage={mediumPercentage.string}
						counts={mediumIssues}
					/>
				</Col>
				<Col md={4} className='align-content-end'>
					<RiskData
						risk={'low'}
						percentage={lowPercentage.string}
						counts={lowIssues}
					/>
				</Col>
			</Row>
		</Container>
	)
}

export default SeverityBlock
