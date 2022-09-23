import React from 'react'
import { Container } from 'react-bootstrap'
import i18n from 'i18next'
import UnassignedBlock from './_unassigned'
import AssignedBlock from './_assigned'

import './style.scss'

const AssignmentsPage = props => {
	const { locale, data } = props
	const groupByAssignee = data.groupByAssignee || {}

	return (
		<Container
			style={{ paddingLeft: 0, paddingRight: 0 }}
			fluid
			className={`${locale} assignments-page`}>
			<div className='title pdf-page-break'>
				{i18n.t('pages.scan-result.pdf.assignments.assignments')}
			</div>
			<UnassignedBlock locale={locale} data={groupByAssignee.unassigned} />
			<AssignedBlock locale={locale} data={groupByAssignee.assigned} />
		</Container>
	)
}

export default AssignmentsPage
