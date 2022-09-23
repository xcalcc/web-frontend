import React from 'react';
import {useSelector, useDispatch} from "react-redux";
import {Container, Row, Col} from "react-bootstrap";
import {useHistory} from 'react-router-dom';
import i18n from 'i18next';
import * as actions from 'Actions';
import * as utils from "Utils";
import HeaderMenu from './HeaderMenu';

import './style.scss';

const Header = props => {
    const history = useHistory();
    const locale = useSelector(state => state.app.locale);
    const dispatch = useDispatch();
    const setLocale = lang => {
       dispatch(actions.setLocale(lang));
    }

    const goToDashboard = () => {
        history.push('/dashboard');
    }

    const logo = <div className="logo" onClick={goToDashboard}>
        <img src={utils.getThemeImg(locale !== 'en' ? "logo-cn.svg" : "logo.png")} />
    </div>

    const localeSwitcher = <div className="action-container__item">
        <a className={locale === 'zh-CN' ? 'active' : null } onClick={() => setLocale('zh-CN')}>{i18n.t('common.header.locale.zh-CN')}</a>|
        <a className={locale === 'en' ? 'active' : null } onClick={() => setLocale('en')}>{i18n.t('common.header.locale.en')}</a>
    </div>

    const menuTrigger = <div className="action-container__item">
        <HeaderMenu />
    </div>;

    return <Container fluid className="app-header">
        <Row>
            <Col className="logo-container" xs={2}>
                <div className="logo">
                    {logo}
                </div>
            </Col>
            <Col className="action-container" xs={10}>
                {localeSwitcher}
                {menuTrigger}
            </Col>
        </Row>
    </Container>
}

export default Header;