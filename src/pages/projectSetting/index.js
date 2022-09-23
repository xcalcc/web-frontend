import React, {useState, useEffect} from 'react';
import {useDispatch} from "react-redux";
import {useHistory} from 'react-router-dom';
import {Container, Row, Col} from 'react-bootstrap';
import i18n from 'i18next';
import * as actions from 'Actions';
import enums from 'Enums';
import * as utils from "Utils";
import Loader from 'Components/Loader';
import Section from 'Components/Section';
import {XFormGroup, XInput} from 'Components/Form';
import XButton from 'Components/Button';
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
    retentionNum: '',

    /* scanSonfig */
    lang: 'c++',
    scanMemLimit: '',
    build: '',
    buildArgsbuilderPath: '',
    prebuildCommand: '',
    preprocessResultPath: '',
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

    const gotoMyProject = () => {
        history.goBack();
    }

    const onChange = (e) => {
        const data = {};
        const input = e.target;
        data[input.name] = utils.trim(input.value);
        delete errors[input.name];
        setPageData(prevData => {
            return {...prevData, ...data}
        });
        setErrors(errors);
    }

    const onSave = async () => {
        const [hasError] = validation();
        if(hasError) return;

        setLoading(true);
        const result = await dispatch(actions.updateProjectData(pageData.projectUUID, {
            projectId: pageData.projectId,
            retentionNum: pageData.retentionNum || 0
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

    const validation = () => {
        let err = {};
        if(pageData.retentionNum && !/^[1-9]\d{0,}$/.test(pageData.retentionNum)) {
            err['retentionNum'] = true;
            setErrors({...errors, ...err});
        }

        const hasError = Object.keys(err).length > 0;
        return [hasError]
    }

    useEffect(() => {
        (async () => {
            setLoading(true);
            const uuid = props.match.params.projectKey;
            const projectData = await dispatch(actions.fetchConfigByProjectId(uuid));
            if(projectData.error) {
                setLoading(false);
                dispatch(actions.pushAlert({
                    type: 'error',
                    title: i18n.t('common.notifications.failure'),
                    content: utils.getApiMessage(projectData.error)
                }));
                return;
            }

            const buildToolList = String(projectData.lang).toLocaleLowerCase() === 'java' ? enums.BUILD_TOOLS.JAVA : enums.BUILD_TOOLS.C;
            const buildTool = buildToolList.find(x => x.value === projectData.build) || {};

            projectData.build = projectData.build || buildToolList[0].value;
            projectData.hasBuilderPath = buildTool.hasBuilderPath;

            setPageData({...defaultPageData, ...projectData});
            setLoading(false);
        })();
    }, []);

    return <Container fluid className="project-setting-view">
        {isLoading && <Loader />}
        <Row noGutters>
            <Col>
                <h2>{i18n.t('project.settings')}</h2>
            </Col>
        </Row>
        <Row noGutters>
            <Col>
                <Section title={i18n.t('project.project-info')}>
                    <ProjectInfoItem 
                        name={i18n.t('project.project-language')}
                        value={pageData.lang}
                    />
                    <ProjectInfoItem 
                        name={i18n.t('project.project-name')}
                        value={pageData.projectName}
                    />
                    <ProjectInfoItem 
                        name={i18n.t('project.project-id')}
                        value={pageData.projectId}
                    />
                    <ProjectInfoItem 
                        name={i18n.t('project.source-code-path')}
                        value={pageData.relativeSourcePath}
                    />
                    <ProjectInfoItem 
                        name={i18n.t('project.build-file-path')}
                        value={pageData.relativeBuildPath}
                    />
                    {
                        pageData.preprocessResultPath &&
                        <ProjectInfoItem 
                            name={i18n.t('project.preprocess-file-path')}
                            value={pageData.preprocessResultPath}
                        />
                    }
                </Section>
            </Col>
        </Row>
        <Row noGutters>
            <Col>
                <Section title={i18n.t('project.project-configuration')}>
                    <ProjectInfoItem 
                        name={i18n.t('project.build-tool')}
                        value={pageData.build}
                    />
                    {
                        pageData.hasBuilderPath &&
                        <ProjectInfoItem 
                            name={i18n.t('project.build-tool-path')}
                            value={pageData.builderPath}
                        />
                    }
                    <ProjectInfoItem 
                        name={i18n.t('project.build-opt')}
                        value={pageData.buildArgs}
                    />
                    {
                        pageData.lang === 'c++' &&
                        <ProjectInfoItem 
                            name={i18n.t('project.configure-command')}
                            value={pageData.prebuildCommand}
                        />
                    }
                    <ProjectInfoItem 
                        name={i18n.t('project.memory-limit-title')}
                        value={pageData.scanMemLimit}
                    />
                    <ProjectInfoItem 
                        name={i18n.t('common.scan-mode.title')}
                        value={i18n.t(`common.scan-mode.${pageData.scanMode || enums.SCAN_MODE.SINGLE}`)}
                    />
                    <ProjectInfoItem 
                        name={i18n.t('project.upload-source-code')}
                        value={pageData.uploadSource ? i18n.t('project.yes') : i18n.t('project.no')}
                    />
                    <XFormGroup 
                        layout="horizontal"
                        label={i18n.t('project.result-records')}
                        hint={i18n.t('project.result-records-hint')}
                        error={errors.retentionNum}
                    >
                        <XInput 
                            // type="number"
                            maxLength={5}
                            name="retentionNum"
                            onChange={onChange}
                            value={pageData.retentionNum || ''}
                        />
                    </XFormGroup>
                </Section>
            </Col>
        </Row>
        {
            pageData.customConfigList.length > 0 &&
            <Row noGutters>
                <Col>
                    <Section className="other-configuration" title={i18n.t('project.other-configuration')}>
                        {
                            pageData.customConfigList.map(item => {
                                return <ProjectInfoItem 
                                    key={item.id}
                                    name={item.name}
                                    value={item.value}
                                />
                            })
                        }
                    </Section>
                </Col>
            </Row>
        }
        <Row>
            <Col className="text-right">
                <XButton
                    grey
                    label={i18n.t("project.back")}
                    onClick={gotoMyProject}
                />
                <XButton
                    red
                    label={i18n.t("common.save")}
                    onClick={onSave}
                />
            </Col>
        </Row>
    </Container>;
}

const ProjectInfoItem = ({name, value}) => {
    return <Row>
        <Col xs={3} className="label">
            {name}
        </Col>
        <Col className="value">
            {value}
        </Col>
    </Row>;
}

export default ProjectSetting;