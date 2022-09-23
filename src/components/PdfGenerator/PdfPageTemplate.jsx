import React from 'react'
import { Image } from 'react-bootstrap'
import i18n from 'i18next'
import HeaderCnPng from 'Assets/images/svg/pdf_header_cn.svg'
import HeaderEnPng from 'Assets/images/svg/pdf_header_en.svg'
import FooterPng from 'Assets/images/svg/pdf_footer.svg'

import './theme-x.scss'

const PdfPageTemplate = props => {
	const { pageNum = 'x', version = '', userName = '', locale } = props

	const logo = locale === 'en' ? HeaderEnPng : HeaderCnPng
	return (
		<>
			<div
				className='header'
				style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}>
				<Image src={logo} />
			</div>
			<div
				className={`${locale} footer__text`}
				style={{ position: 'absolute', left: '40px', bottom: '30px' }}>
				{i18n.t('pages.scan-result.pdf.footer', {
					pageNumber: pageNum,
					versionNumber: version,
					userName: userName,
				})}
			</div>
			<div
				className='footer__background'
				style={{ position: 'absolute', left: '40px' , right: 0, bottom: 0, width: '100%' }}>
				<Image width={'100%'} height={'40px'} src={FooterPng} />
			</div>
		</>
	)
}

export default PdfPageTemplate
