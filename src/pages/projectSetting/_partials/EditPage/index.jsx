import React, {useState, useEffect, useMemo} from 'react';
import {useDispatch} from "react-redux";
import {useHistory} from 'react-router-dom';
import {Container, Row, Col, Form} from 'react-bootstrap';
import i18n from 'i18next';
import * as actions from 'Actions';
import * as utils from "Utils";
import enums from 'Enums';
import Loader from 'Components/Loader';
import Section from 'Components/Section';
import {XCheckbox} from 'Components/Form';
import XButton from 'Components/Button';
import ConfigWithProject from './_partials/ConfigWithProject';
import ConfigWithScan from './_partials/ConfigWithScan';
import ConfigWithCustom from './_partials/ConfigWithCustom';
import './style.scss';

let defaultPageData = {
    projectUUID: '',
    projectConfigUUID: '',
    projectConfigName: '',

    /* projectConfig */
    projectName: '',
    projectId: '',
    sourceStorageName: '',
    sourceStorageType: '',
    uploadSource: true,
    gitUrl: '',
    relativeSourcePath: '',
    relativeBuildPath: '',
    gerritProjectId: '',
    username: '',
    token: '',
    branch: '',

    /* scanSonfig */
    lang: 'c++',
    scanMemLimit: '',
    build: '',
    builderPath: '',
    prebuildCommand: '',
    buildArgs: '',
    jobQueueName: '',
    customConfigList: [],

    /* other state */
    isCreateAndScan: false,
    isSelectedOtherBuild: false,
    hasBuilderPath: false
};

const ProjectSetting = props => {
    const dispatch = useDispatch();
    const history = useHistory();
    
    const [isLoading, setLoading] = useState(true);
    const [pageData, setPageData] = useState(defaultPageData);
    const [errors, setErrors] = useState({});
    const [editProjectNotificationId, setEditProjectNotificationId] = useState();

    useMemo(() => {
        setEditProjectNotificationId(undefined);
    }, []);

    const updatePageData = data => {
        setPageData(prevData => {
            return {...prevData, ...data}
        });

        if(!editProjectNotificationId) {
            setEditProjectNotificationId(enums.NOTIFICATION_IDS.PROJECT_SETTING__INPUT_CHANGE);

            dispatch(actions.pushNotification({
                id: enums.NOTIFICATION_IDS.PROJECT_SETTING__INPUT_CHANGE,
                type: 'warning',
                level: 'page',
                path: props.pageName,
                content: i18n.t('project.edit-warning')
            }));
        }
    }
    const handleSelectUpload = () => {
        updatePageData({'uploadSource': !pageData.uploadSource});
    }
    const handleSelectBuild = (option) => {
        const buildToolData = option.value;
        if(buildToolData.value === pageData.build) return;

        if(buildToolData.value === 'other') {
            updatePageData({
                build: '',
                builderPath: '',
                hasBuilderPath: buildToolData.hasBuilderPath,
                isSelectedOtherBuild: true
            });
        } else {
            updatePageData({
                build: buildToolData.value,
                builderPath: '',
                hasBuilderPath: buildToolData.hasBuilderPath,
                isSelectedOtherBuild: false
            });
        }

        const _errors = {...errors};
        delete _errors['build'];
        setErrors(_errors);
    }
    const handleInputChange = (e) => {
        const data = {};
        const input = e.target;
        data[input.name] = input.value;
        updatePageData(data);
    }
    const handleInputKeyUp = (e) => {
        const input = e.target;
        if(input.value) {
            const _errors = {...errors};
            delete _errors[input.name];
            setErrors(_errors);
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const [hasError, _errors] = utils.validationWithProject({
            formElement: e.currentTarget, 
            pageData, 
            isCreatePage: false, 
            stepIndex: null
        });

        if(hasError) {
            setErrors(_errors);
            return;
        }

        editProject();
    }

    const editProject = async () => {
        setLoading(true);
        const result = await dispatch(actions.updateProject({
            projectUUID: pageData.projectUUID,
            projectConfigUUID: pageData.projectConfigUUID,
            projectConfigName: pageData.projectConfigName,
            projectData: pageData
        }));
        setLoading(false);

        if(result.error) {
            dispatch(actions.pushAlert({
                type: 'error',
                title: i18n.t('common.notifications.failure'),
                content: utils.getApiMessage(result.error)
            }));
            return;
        }

        dispatch(actions.pushAlert({
            type: 'message',
            title: i18n.t('common.notifications.success'),
            content: i18n.t('common.notifications.project-update-success')
        }));
    }

    useEffect(() => {
        (async () => {
            const uuid = props.match.params.projectKey;
            const projectData = await dispatch(actions.fetchConfigByProjectId(uuid));

            if(projectData.jobQueueName === 'public_default') {
                projectData.jobQueueName = '';
            }

            const buildToolList = String(projectData.lang).toLocaleLowerCase() === 'java' ? enums.BUILD_TOOLS.JAVA : enums.BUILD_TOOLS.C;
            const buildTool = buildToolList.find(x => x.value === projectData.build) || {};

            projectData.build = projectData.build || buildToolList[0].value;
            projectData.hasBuilderPath = buildTool.hasBuilderPath;

            setPageData({...defaultPageData, ...projectData});
            setLoading(false);
        })();
    }, []);

    return <Container fluid className="project-setting-edit">
        {isLoading && <Loader />}
        <Row noGutters>
            <Col>
                <h2>{i18n.t('project.settings')}</h2>
            </Col>
        </Row>
        <Form onSubmit={handleSubmit}>
            <Row noGutters>
                <Col>
                    <Section title={i18n.t('project.project-info')}>
                        <ConfigWithProject
                            errors={errors}
                            pageData={pageData}
                            onChange={handleInputChange}
                            onKeyUp={handleInputKeyUp}
                        />
                    </Section>
                </Col>
            </Row>
            <Row noGutters>
                <Col>
                    <Section title={i18n.t('project.project-configuration')}>
                        <ConfigWithScan
                            errors={errors}
                            pageData={pageData}
                            onChange={handleInputChange}
                            onKeyUp={handleInputKeyUp}
                            onSelectBuild={handleSelectBuild}
                        />
                    </Section>
                </Col>
            </Row>
            <Row noGutters>
                <Col>
                    <Section className="other-configuration" title={i18n.t('project.other-configuration')}>
                        <ConfigWithCustom
                            pageData={pageData}
                            updatePageData={updatePageData}
                        />
                    </Section>
                </Col>
            </Row>
            <Row noGutters>
                <Col md={6}>
                    <XCheckbox
                        name="uploadSource"
                        checked={pageData.uploadSource}
                        label={i18n.t('project.upload-source-code')}
                        hint={i18n.t('project.upload-source-code-hint')}
                        onClick={handleSelectUpload}
                    />
                </Col>
                <Col md={6} className="text-right">
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
        </Form>
    </Container>;
}

export default ProjectSetting;