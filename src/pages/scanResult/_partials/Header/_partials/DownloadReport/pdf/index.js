import React from 'react';
import PDFDoc from 'Components/PdfGenerator';
import PdfPageTemplate from 'Components/PdfGenerator/PdfPageTemplate';
import ProjectSummaryPage from './_partials/ProjectSummaryPage';
import DirectoryPage from './_partials/DirectoryPage';
import AssignmentsPage from './_partials/AssignmentsPage';
import { savePDF } from '@progress/kendo-react-pdf';
import Enums from 'Enums';
import store from 'Store';
import {getUserInfo} from 'Actions';

import './styles.scss';

const theme = 'x';

const exportPdf = async (pdfData, locale) => {
	await store.dispatch(getUserInfo());
	const userState = store.getState()['user'];
	const appState = store.getState()['app'];

	return new Promise(resolve => {
		const pdfDomElement = document.getElementById('pdf');

		const { fileName, data } = pdfData;

		const projectSummaryPagePdfDoc = PDFDoc(
			<ProjectSummaryPage data={data} locale={locale} />,
			{
				theme,
			}
		)
		pdfDomElement.innerHTML += projectSummaryPagePdfDoc;

		const directoryPagePdfDoc = PDFDoc(
			<DirectoryPage data={data} locale={locale} />,
			{
				theme,
			}
		);
		pdfDomElement.innerHTML += directoryPagePdfDoc;

		const assignmentsPagePdfDoc = PDFDoc(
			<AssignmentsPage data={data} locale={locale} />,
			{
				theme,
			}
		);
		pdfDomElement.innerHTML += assignmentsPagePdfDoc;

		savePDF(
			pdfDomElement,
			{
				paperSize: [Enums.PDF.WIDTH, Enums.PDF.HEIGHT],
				fileName,
				pageTemplate: props => <PdfPageTemplate className={locale} {...props} locale={locale} userName={userState.userInfo.displayName} version={appState.appInfo.version} />,
				margin: { top: Enums.PDF.MARGIN.TOP, right: Enums.PDF.MARGIN.RIGHT, left: Enums.PDF.MARGIN.LEFT, bottom: Enums.PDF.MARGIN.BOTTOM },
				repeatHeaders: true,
				forcePageBreak: '.pdf-page-break',
			},
			() => {
				//dev
				// document.body.appendChild(pdfDomElement);
				// document.body.style = "overflow: scroll;"
				pdfDomElement.innerHTML = ''
				resolve()
			}
		);
	});
}

export default exportPdf;
