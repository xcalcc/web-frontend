import React from "react";
import {useSelector} from "react-redux";
import i18n from 'i18next';
import {Container, Row, Col, Image} from "react-bootstrap";
import Section from 'Components/Section';
import CodeLinesLimit from './_partials/CodeLinesLimit';
import Archive from './_partials/Archive';
import ResultRecords from './_partials/ResultRecords';
import SettingIcon from 'Images/icon/project-settings-icon.png';
import './style.scss';

const DataManagement = props => {
    const isAdmin = useSelector(state => state.user.userInfo.isAdmin);

    return <Container fluid className="settings data-management">
        <Row className="settings-title">
            <Col className="text-center">
                <Image className="icon" src={SettingIcon} />
                <p>{i18n.t('pages.settings.data-management.title')}</p>
            </Col>
        </Row>
        <Row className="settings-wrap">
            <Section title={i18n.t('pages.settings.line-of-code-title')}>
                <CodeLinesLimit />
            </Section>
            {
                isAdmin && 
                <>
                    <hr />
                    <Section title={i18n.t('pages.settings.data-management.archive.title')}>
                        <Archive />
                    </Section>
                    <hr />
                    <Section title={i18n.t('pages.settings.data-management.result-records.title')}>
                        <ResultRecords />
                    </Section>
                </>
            }
        </Row>
    </Container>
}
export default DataManagement;
