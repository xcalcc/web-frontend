import React from 'react'
import { Container } from 'react-bootstrap'
import i18n from 'i18next'
import DirectorySummaryTable from './_directorySummaryTable'

import './style.scss'

const extractTableData = data => {
	return data.groupByFile
}

const DirectoryPage = props => {
	const { locale, data } = props

	const tableData = extractTableData(data)
	const table = <DirectorySummaryTable locale={locale} tableData={tableData} />

	return (
		<Container
			style={{ paddingLeft: 0, paddingRight: 0 }}
			fluid
			className={`${locale} directory-page`}>
			<div className='title pdf-page-break'>
				{i18n.t('pages.scan-result.pdf.directory.directories')}
			</div>

			<div className='directory-table'>{table}</div>
		</Container>
	)
}

export default DirectoryPage
