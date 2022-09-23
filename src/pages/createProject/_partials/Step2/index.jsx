import React from 'react';
import {Row, Col, Form} from 'react-bootstrap';
import i18n from 'i18next';
import enums from 'Enums';
import * as utils from "Utils";
import XButton from 'Components/Button';
import {XFormGroup, XDropdown, XRadio} from 'Components/Form';
// import Dropzone from 'Components/Dropzone';
import ConfigWithC from './ConfigWithC';
import ConfigWithJava from './ConfigWithJava';
import ConfigWithCustom from './ConfigWithCustom';

const CONFIG_METHOD = {
    NO_SELECT: null,
    EXISTING: 'old',
    NEW: 'new'
};

const Step2 = props => {
    const {
        errors,
        pageData,
        recentProjectList,
        updatePageData,
        onSelectBuild,
        onChange,
        onKeyUp,
        onSubmit
    } = props;

    const handleSelectRecent = (option) => {
        const project = option.value;
        const projectConfig = project.projectConfig || {};
        const attributes = projectConfig.attributes || [];

        const scanConfig = {};
        let customConfigList = [];
        attributes.forEach(item => {
            if(item.type === enums.PROJECT_ATTRIBUTE_TYPE.scan){
                if(!enums.SCAN_CONFIG_KEY_LIST.includes(item.name)) {
                    customConfigList.push({
                      id: utils.getRandom(),
                      name: item.name,
                      value: item.value
                    });
                } else {
                    scanConfig[item.name] = item.value;
                }
            }
        });

        delete scanConfig.uploadSource;

        if(scanConfig['scanMemLimit']) {
            scanConfig['scanMemLimit'] = scanConfig['scanMemLimit'].replace(/[a-z]/ig, '');
        }

        updatePageData({
            customConfigList,
            currentRecentProjectName: project.name,
            ...scanConfig
        });
    }

    const handleSelectUpload = () => {
        updatePageData({'uploadSource': !pageData.uploadSource});
    }

    // const passFileContent = content => {
    //     updatePageData({
    //         ...pageData,
    //         ...content
    //     });
    // }

    return (
        <>
            <Row noGutters className="justify-content-center">
                <Col md={6}>
                    <h3 className="title">{i18n.t("project.project-information")}</h3>
                </Col>
            </Row>
            <Row noGutters className="justify-content-center">
                <Col md={6}>
                    <Form onSubmit={onSubmit}>
                        <XFormGroup label={i18n.t('project.project-configuration-method')}>
                            <XRadio
                                name="configMethod"
                                value={CONFIG_METHOD.EXISTING}
                                label={i18n.t('project.use-old-configuration')}
                                checked={pageData.configMethod === CONFIG_METHOD.EXISTING}
                                onChange={onChange}
                            />
                            <XRadio
                                name="configMethod"
                                value={CONFIG_METHOD.NEW}
                                label={i18n.t('project.use-new-configuration')}
                                checked={pageData.configMethod === CONFIG_METHOD.NEW}
                                onChange={onChange}
                            />
                        </XFormGroup>

                        {
                            pageData.configMethod === CONFIG_METHOD.EXISTING &&
                            <XFormGroup label={i18n.t('project.select-configuration-title')}>
                                <Row>
                                    <Col md="7">
                                        <XDropdown
                                            placeholder={i18n.t('project.select-configuration')}
                                            value={pageData.currentRecentProjectName}
                                            options={
                                                recentProjectList.map(item => ({
                                                    label: item.name,
                                                    value: item
                                                }))
                                            }
                                            onSelect={handleSelectRecent}
                                        />
                                    </Col>
                                </Row>
                            </XFormGroup>
                        }

                        {/* config form for c or java */}
                        {
                            (pageData.configMethod === CONFIG_METHOD.NEW || !!pageData.currentRecentProjectName) &&
                            (
                                pageData.lang === 'c++' ? 
                                <ConfigWithC 
                                    errors={errors}
                                    pageData={pageData}
                                    onChange={onChange}
                                    onKeyUp={onKeyUp}
                                    onSelectBuild={onSelectBuild}
                                    updatePageData={updatePageData}
                                /> :
                                <ConfigWithJava
                                    errors={errors}
                                    pageData={pageData}
                                    onChange={onChange}
                                    onKeyUp={onKeyUp}
                                    onSelectBuild={onSelectBuild}
                                    updatePageData={updatePageData}
                                />
                            )
                        }

                        {
                            (pageData.configMethod === CONFIG_METHOD.NEW || !!pageData.currentRecentProjectName) && 
                            <>
                                <ConfigWithCustom 
                                    pageData={pageData}
                                    updatePageData={updatePageData}
                                />
                                {/*<XFormGroup>*/}
                                {/*    <Form.Label>Custom config</Form.Label>*/}
                                {/*    <Form.Control as="textarea" rows={3} />*/}
                                {/*</XFormGroup>*/}

                                {/* <XFormGroup>
                                    <Dropzone passFileContent={passFileContent}/>
                                </XFormGroup> */}

                                <XFormGroup>
                                    <XRadio 
                                        name="uploadSource"
                                        checked={pageData.uploadSource}
                                        label={i18n.t('project.upload-source-code')}
                                        hint={i18n.t('project.upload-source-code-hint')}
                                        onClick={handleSelectUpload}
                                    />
                                </XFormGroup>

                                <Row noGutters>
                                    <Col className="text-right">
                                        <XButton
                                            type="submit"
                                            className="link"
                                            label={i18n.t("project.save-configuration")}
                                            onClick={() => updatePageData({isCreateAndScan: false})}
                                        />
                                        <XButton
                                            red
                                            type="submit"
                                            label={i18n.t("project.scan")}
                                            onClick={() => updatePageData({isCreateAndScan: true})}
                                        />
                                    </Col>
                                </Row>
                            </>
                        }
                    </Form>
                </Col>
            </Row>
        </>
    )
}

export default Step2;