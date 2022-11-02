import React, {useState, useEffect} from "react";
import i18n from 'i18next';
import {useDispatch} from 'react-redux';
import {useHistory, useLocation} from 'react-router-dom';
import {Container, Row, Col, Image} from 'react-bootstrap';
import * as actions from 'Actions';
import * as utils from 'Utils';
import enums from 'Enums';
import Loader from 'Components/Loader';
import ConfirmPrompt from 'Containers/ConfirmPrompt';
import AddContent from './_partials/add';
import ListContent from './_partials/list';
import SettingIcon from 'Images/icon/administration-icon.svg';
import './style.scss';

const IssueFilter = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();

    const defaultIssueData = {
        projectId: '',
        scanTaskId: '',
        ruleCode: '',
        filePath: '',
        variableName: '',
        functionName: '',
    };

    if(!utils.isEnableDevModeOption(enums.DEV_MODE_OPTION.validation)) {
        defaultIssueData.ruleCode = 'ERR33-C';
    }

    const [issueData, setIssueData] = useState(defaultIssueData);
    const [filterList, setFilterList] = useState();
    const [isRefreshList, setIsRefreshList] = useState();
    const [currentDeleteId, setCurrentDeleteId] = useState();
    const [isShowDeleteAlert, setIsShowDeleteAlert] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const data = {};
        const input = e.target;
        data[input.name] = input.value.trim();

        setIssueData(prevData => {
            return {...prevData, ...data}
        });
    }

    const handleSave = async () => {
        if(!issueData.ruleCode && !issueData.filePath) {
            alertWarning(i18n.t('pages.issue-filters.validation.data-empty'));
            return;
        }

        let csvCode;
        if(issueData.ruleCode) {
            const ruleCode = issueData.ruleCode.toLocaleUpperCase();
            csvCode = utils.scanResultHelper.getCsvCodeByRuleCode(ruleCode) || ruleCode;
        }

        const isExists = filterList.findIndex(x => 
            utils.isStringFuzzyEqual(x.ruleCode, csvCode) &&
            utils.isStringFuzzyEqual(x.filePath, issueData.filePath) &&
            utils.isStringFuzzyEqual(x.functionName, issueData.functionName) &&
            utils.isStringFuzzyEqual(x.variableName, issueData.variableName)
        ) > -1;

        if(isExists) {
            alertWarning(i18n.t('pages.issue-filters.validation.data-exists'));
            return;
        }

        setIsLoading(true);

        const result = await dispatch(actions.addIssueValidation({
            projectId: issueData.projectId,
            scanTaskId: issueData.scanTaskId,
            ruleCode: csvCode,
            filePath: issueData.filePath,
            functionName: issueData.functionName,
            variableName: issueData.variableName,
            lineNumber: issueData.lineNumber,
            type: enums.ISSUE_VALIDATION_TYPE.CUSTOM,
            action: enums.ISSUE_VALIDATION_ACTION.IGNORE,
            scope: enums.ISSUE_VALIDATION_SCOPE.GLOBAL
        }));

        if(result.error) {
            alertError(result.error);
            setIsLoading(false);
        } else {
            setIssueData(defaultIssueData);
            setIsRefreshList(Math.random());
            alertSuccess(() => {
                // remove the URL parameter passed from the scan result page
                history.replace(location.pathname);
            });
        }
    }

    const handleDelete = id => {
        setCurrentDeleteId(id);
        setIsShowDeleteAlert(true);
    }

    const deleteFilter = async () => {
        setIsShowDeleteAlert(false);
        setIsLoading(true);
        const result = await dispatch(actions.deleteIssueValidation(currentDeleteId));
        if(result.error) {
            alertError(result.error);
            setIsLoading(false);
        } else {
            setIsRefreshList(Math.random());
        }
    }

    const alertSuccess = callback => {
        dispatch(actions.pushAlert({
            type: 'message',
            title: i18n.t('common.success'),
            content: i18n.t('common.create-success'),
            callbackFn: callback
        }));
    }

    const alertWarning = msg => {
        dispatch(actions.pushAlert({
            type: 'warning',
            content: msg,
        }));
    }

    const alertError = error => {
        dispatch(actions.pushAlert({
            type: 'error',
            title: i18n.t('common.notifications.failure'),
            content: utils.getApiMessage(error)
        }));
    }

    useEffect(() => {
        if(location.search) {
            const urlParams = new URLSearchParams(location.search);
            const autoFillData = {
                projectId: urlParams.get('projectId') || '',
                scanTaskId: urlParams.get('scanTaskId') || '',
                ruleCode: urlParams.get('ruleCode') || '',
                filePath: urlParams.get('filePath') || '',
                variableName: urlParams.get('variableName') || '',
                functionName: urlParams.get('functionName') || '',
            };

            if(!utils.isEnableDevModeOption(enums.DEV_MODE_OPTION.validation)) {
                delete autoFillData.filePath;
                delete autoFillData.functionName;
            }

            setIssueData(autoFillData);
        }
    }, []);

    useEffect(() => {
        (async () => {
            setIsLoading(true);

            await dispatch(actions.fetchRuleList());

            const response = await dispatch(actions.searchIssueValidationList({
                type: enums.ISSUE_VALIDATION_TYPE.CUSTOM
            }));

            if(response.error) {
                alertError(response.error);
                setIsLoading(false);
                return;
            }

            const list = (response.content || []).sort((a, b) => b.createdOn - a.createdOn);

            setFilterList(list);
            setIsLoading(false);
        })();
    }, [isRefreshList]);

    return <Container fluid className="settings data-management issue-filters">
        {isLoading && <Loader/>}
        <Row className="settings-title">
            <Col className="text-center">
                <Image className="icon" src={SettingIcon} />
                <p>{i18n.t('pages.issue-filters.title')}</p>
            </Col>
        </Row>
        <Row className="settings-wrap">
            <AddContent
                issueData={issueData}
                onChange={handleInputChange}
                onSave={handleSave}
            />
            <ListContent
                filterList={filterList}
                onDelete={handleDelete}
            />
        </Row>
        <ConfirmPrompt
            show={isShowDeleteAlert}
            title={i18n.t('common.are-you-sure')}
            cancelBtnText={i18n.t('common.buttons.cancel')}
            confirmBtnText={i18n.t('common.delete-it')}
            contentText={i18n.t('common.delete-tip')}
            onConfirm={deleteFilter}
            onCancel={() => setIsShowDeleteAlert(false)}
            onHide={() => setIsShowDeleteAlert(false)}
        />
    </Container>
}

export default IssueFilter;
