import React from 'react';
import { Container } from 'react-bootstrap';
import { renderToStaticMarkup } from 'react-dom/server';

const View = props => {
	const { page, theme = 'x' } = props;

	switch (theme) {
		case 'x':
		default:
			return (
				<Container
					style={{ paddingLeft: 0, paddingRight: 0 }}
					fluid
					id='pdf-view'
					className='theme-x'
				>
					{page}
				</Container>
			)
	}
}

const PDFDoc = (page = '', options) => {
	const { theme = 'x' } = options;

	return renderToStaticMarkup(<View page={page} theme={theme} {...options} />);
}

export default PDFDoc
