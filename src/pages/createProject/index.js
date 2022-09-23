import React, {useState, useEffect} from 'react';
import {useDispatch} from "react-redux";
import {useHistory, useLocation} from 'react-router-dom';
import {Container, Row, Col} from 'react-bootstrap';
import i18n from 'i18next';
import {ArrowLeftShort} from 'react-bootstrap-icons';
import * as utils from "Utils";
import enums from 'Enums';
import * as actions from 'Actions';
import Loader from 'Components/Loader';
import Steps from 'Components/Steps';
import Step1 from './_partials/Step1';
import Step2 from './_partials/Step2';

import './style.scss';
import addProjectIcon from 'Assets/images/icon/new-projct.svg';

let defaultPageDataWithCreate = {
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
    hasBuilderPath: false,
    configMethod: null,
    currentRecentProjectName: null
};

let defaultPageDataWithEdit = {
    ...defaultPageDataWithCreate,
    lang: null,
    configMethod: 'new'
}

const CreateProject = props => {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    const isEdit = location.pathname.indexOf('/project-edit') > -1;
    let defaultPageData = isEdit ? defaultPageDataWithEdit : defaultPageDataWithCreate;
        defaultPageData = JSON.parse(JSON.stringify(defaultPageData));

    const [isLoading, setLoading] = useState(true);
    const [stepIndex, setStepIndex] = useState(1);
    const [fileStorageList, setFileStorageList] = useState([]);
    const [recentProjectList, setRecentProjectList] = useState([]);
    const [pageData, setPageData] = useState(defaultPageData);
    const [dataWithEdit, setDataWithEdit] = useState({});
    const [errors, setErrors] = useState({});

    const updatePageData = data => {
        setPageData(prevData => {
            return {...prevData, ...data}
        });
    }
    const previousStep = () => {
        if(stepIndex > 1) {
            setStepIndex(stepIndex - 1);
        }
    }
    const nextStep = () => {
        if(stepIndex < steps.length) {
            setStepIndex(stepIndex + 1);
        }
    }
    const handleSelectBuild = (option) => {
        const buildToolData = option.value;
        if(buildToolData.value === pageData.build) return;

        if(buildToolData.value === 'other') {
            updatePageData({
                build: '',
                hasBuilderPath: buildToolData.hasBuilderPath,
                isSelectedOtherBuild: true
            });
        } else {
            updatePageData({
                build: buildToolData.value,
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
        if(input.name === 'lang') {
            data.build = '';
            data.hasBuilderPath = false;
            data.isSelectedOtherBuild = false;
        }
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
            isCreatePage: true, 
            stepIndex
        });

        if(hasError) {
            setErrors(_errors);
            return;
        }

        if(stepIndex < steps.length) {
            nextStep();
        } else {
            isEdit ? 
            editProject(pageData.isCreateAndScan):
            newProject(pageData.isCreateAndScan);
        }
    }

    const newProject = async (isCreateAndScan) => {
        setLoading(true);
        const project = await dispatch(actions.createProject(pageData));
        setLoading(false);
        if(project.error) {
            dispatch(actions.pushAlert({
                type: 'error',
                title: i18n.t('common.notifications.failure'),
                content: utils.getApiMessage(project.error)
            }));
        } else {
            dispatch(actions.pushAlert({
                type: 'message',
                title: i18n.t('common.notifications.success'),
                content: i18n.t('common.notifications.project-create-success'),
                callbackFn: async () => {
                    setPageData(defaultPageData);
                    history.push("/dashboard");
                }
            }));
        }
    }
    const editProject = async (isCreateAndScan) => {
        setLoading(true);
        const result = await dispatch(actions.updateProject({
            projectUUID: dataWithEdit.projectUUID,
            projectConfigUUID: dataWithEdit.projectConfigUUID,
            projectConfigName: dataWithEdit.projectConfigName,
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
            const _fileStorageList = await dispatch(actions.fetchFileStorageList());
            const _recentProjectList = await dispatch(actions.fetchRecentProjectList());
            setFileStorageList(_fileStorageList);
            setRecentProjectList(_recentProjectList);

            updatePageData({
                sourceStorageName: _fileStorageList[0].name,
                sourceStorageType: _fileStorageList[0].fileStorageType,
            });

            if(isEdit) {
                let uuid = props.match.params.projectKey
                const projectData = await dispatch(actions.fetchConfigByProjectId(uuid));

                if(projectData.jobQueueName === 'public_default') {
                    projectData.jobQueueName = '';
                }

                const buildToolList = projectData.lang.toLocaleLowerCase() === 'java' ? enums.BUILD_TOOLS.JAVA : enums.BUILD_TOOLS.C;
                const buildTool = buildToolList.find(x => x.value === projectData.build) || {};
                projectData.hasBuilderPath = buildTool.hasBuilderPath;

                setDataWithEdit({
                    projectUUID: projectData.projectUUID,
                    projectConfigUUID: projectData.projectConfigUUID,
                    projectConfigName: projectData.projectConfigName
                });
                setPageData({...defaultPageData, ...projectData});
            }

            setLoading(false);
        })();
    }, []);

    const steps = [
        <Step1
            isEdit={isEdit}
            errors={errors}
            setErrors={setErrors}
            pageData={pageData}
            fileStorageList={fileStorageList} 
            updatePageData={updatePageData}
            onChange={handleInputChange}
            onKeyUp={handleInputKeyUp}
            onSubmit={handleSubmit}
        />, 
        <Step2
            isEdit={isEdit}
            errors={errors}
            setErrors={setErrors}
            pageData={pageData}
            recentProjectList={recentProjectList}
            updatePageData={updatePageData}
            onSelectBuild={handleSelectBuild}
            onChange={handleInputChange}
            onKeyUp={handleInputKeyUp}
            onSubmit={handleSubmit}
        />
    ];

    return (
        <Container fluid className="create-project-wrapper">
            {isLoading && <Loader />}
            <Row>
                <Col>
                    {
                        stepIndex > 1 && 
                        <div 
                            className="create-project-wrapper__back-button"
                            onClick={previousStep}
                        >
                            <ArrowLeftShort />
                        </div>
                    }
                </Col>
            </Row>
            <Row noGutters className="create-project-wrapper__header">
                <Col className="text-center">
                    <img src={addProjectIcon} className="big-icon" />
                    <h2>{i18n.t("project.project-title")}</h2>
                </Col>
            </Row>
            <Row noGutters>
                <Col className="text-center">
                    <Steps totalSteps={steps.length} current={stepIndex} />
                </Col>
            </Row>

            {steps[stepIndex-1]}
        </Container>
    )
}

export default CreateProject;