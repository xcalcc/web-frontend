import React from 'react'
import './style.scss'

const PDFTable = props => {
	const { id, headers, children } = props
	const getTableHead = headRows => {
		return (
			<thead>
				<tr>
					{headRows
						.filter(x => x.isShow || x.isShow === undefined)
						.map(row => (
							<th key={row.field} className={row.className}>
								{row.label}
							</th>
						))}
				</tr>
			</thead>
		)
	}
	const tableHeader = (headers && getTableHead(headers)) || ''

	return (
		<table id={id} className='pdf-table block'>
			{tableHeader}
			<tbody className='scroll'>{children}</tbody>
		</table>
	)
}

export default PDFTable
