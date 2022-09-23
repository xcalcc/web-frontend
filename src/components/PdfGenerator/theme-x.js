import React from 'react';
import {Image} from 'react-bootstrap';
import i18n from 'i18next';
import HeaderCnPng from 'Assets/images/pdf/header-cn.png';
import HeaderEnPng from 'Assets/images/pdf/header-en.png';
import FooterPng from 'Assets/images/pdf/footer.png';

import './theme-x.scss';

const ThemeX = props => {
    const {
        pageNum = 'x',
        version = '',
        userName = '',
        locale,
        width,
    } = props;
    const logo = locale === 'en' ? HeaderEnPng : HeaderCnPng;
    return <div className="theme-x" style={{
        width: `${width - 15}px`
    }}>
        <div className='header'>
            <Image src={logo}/>
        </div>
        <div className="pdf-content">{props.children}</div>
        <div className='footer'>
            {i18n.t('pages.scan-result.pdf.footer', {
                pageNumber: pageNum,
                versionNumber: version,
                userName: userName,
            })}
            <Image src={FooterPng}/>
        </div>
    </div>;
}

export default ThemeX;
