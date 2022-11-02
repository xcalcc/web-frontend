import React from 'react';
import i18n from 'i18next';
import {Container, Row, Col} from 'react-bootstrap';
import * as utils from 'Utils';
import enums from 'Enums';
import Section from 'Components/Section';
import {XInput} from 'Components/Form';
import XButton from 'Components/Button';

const Add = props => {
    const {
        issueData,
        onChange,
        onSave
    } = props;

    return <Section title={i18n.t('pages.issue-filters.section-new-title')}>
        <Container fluid className="settings-content noPadding">
            <Row noGutters>
                <Col>
                    {
                        utils.isEnableDevModeOption(enums.DEV_MODE_OPTION.validation) && 
                        <div className="settings-content-title">
                            {i18n.t('pages.issue-filters.section-new-description')}
                        </div>
                    }
                </Col>
            </Row>
            <Row className="input-wrap">
                <Col md={6}>
                    <p>{i18n.t('pages.issue-filters.rule-code')}</p>
                    <XInput 
                        type="text"
                        maxLength={20}
                        name="ruleCode"
                        value={issueData.ruleCode}
                        onChange={onChange}
                    />
                </Col>
                <Col md={6}>
                    <p>{i18n.t('pages.issue-filters.variable-name')}</p>
                    <XInput 
                        type="text"
                        name="variableName"
                        value={issueData.variableName}
                        onChange={onChange}
                    />
                </Col>
            </Row>
            {
                utils.isEnableDevModeOption(enums.DEV_MODE_OPTION.validation) &&
                <Row className="input-wrap">
                    <Col md={6}>
                        <p>{i18n.t('pages.issue-filters.file-path')}</p>
                        <XInput 
                            type="text"
                            name="filePath"
                            value={issueData.filePath}
                            onChange={onChange}
                        />
                    </Col>
                    <Col md={6}>
                        <p>{i18n.t('pages.issue-filters.function-name')}</p>
                        <XInput 
                            type="text"
                            name="functionName"
                            value={issueData.functionName}
                            onChange={onChange}
                        />
                    </Col>
                </Row>
            }
            <Row className="input-wrap">
                <Col className="text-right">
                    <XButton
                        red
                        label={i18n.t("pages.issue-filters.button-save")}
                        onClick={onSave}
                    />
                </Col>
            </Row>
        </Container>
    </Section>
}

export default Add;