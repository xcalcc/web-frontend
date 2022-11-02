import React, {useEffect, useMemo, useState} from 'react';
import {Route, Switch, useLocation, useHistory} from 'react-router-dom';
import {Container, Row, Col} from 'react-bootstrap';
import {useSelector, useDispatch} from 'react-redux';
import i18n from 'i18next';
import  enums from 'Enums';
import * as utils from 'Utils';
import * as actions from 'Actions';
import Loader from 'Components/Loader';
import Header from './_partials/Header';
import ScanCharts from './_partials/ScanCharts';
import GeneralPage from './General';
import DetailPage from './Detail';
import './style.scss';

const ScanResult = props => {
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();

    const _scanTaskId = props.match.params.scanTaskId;
    const projectKey = props.match.params.projectKey;
    const isDsrPage = location.pathname.indexOf('/project/') > -1 && location.pathname.indexOf('/scan') > -1;

    const [isLoading, setIsLoading] = useState(false);
    const [projectUuid, setProjectUuid] = useState();
    const [projectName, setProjectName] = useState('');
    const [scanTaskId, setScanTaskId] = useState(_scanTaskId);
    const [scanMode, setScanMode] = useState();
    const [isIgnoreView, setIsIgnoreView] = useState(false);

    const currentScanSummary = useSelector(state => state.scan.currentScanSummary);
    const previousScanSummary = useSelector(state => state.scan.previousScanSummary);
    const currentProjectSummary = utils.scanResultHelper.extractSummaryData(currentScanSummary);
    const previousProjectSummary = utils.scanResultHelper.extractSummaryData(previousScanSummary);

    const getFilterCacheData = () => {
        const currFilterCacheData = utils.scanResultHelper.getFilterDataFromCache({
            isMisraPage: false,
            isDsrPage,
            projectKey
        });
        dispatch(actions.getPageActions('scanResult').resetScanResultFilter(currFilterCacheData));
    }

    const resetPagingData = () => {
        const previousUrl = dispatch(actions.getPreviousUrl());
        if(previousUrl.indexOf('/issue/') === -1) {
            dispatch(actions.getPageActions('scanResult').resetIssuePaging());
        }
    }

    useMemo(() => setScanTaskId(_scanTaskId), [_scanTaskId]);

    useMemo(() => {
        getFilterCacheData();
        resetPagingData();
    }, []);

    useEffect(() => {
        (async () => {
            await dispatch(actions.getUserList());
            await dispatch(actions.fetchRuleSetList());
            await dispatch(actions.fetchRuleList());
            await dispatch(actions.fetchStandards());
            if(enums.ENABLE_CUSTOM_RULE) {
                await dispatch(actions.fetchCustomRuleMap(projectKey));
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            setIsLoading(true);

            let scanSummary = {};
            const scanSummaryFilter = {
                ruleSets: enums.BUILTIN_RULE_SETS,
                dsrType: [enums.DSR_TYPE.NEW, ...enums.DSR_TYPE.OUTSTANDING_ALL]
            };

            const project_uuid = await dispatch(actions.fetchProjectUuid(projectKey));

            if(project_uuid.error) {
                setIsLoading(false);
                dispatch(actions.pushAlert({
                    type: 'error',
                    title: i18n.t('common.notifications.failure'),
                    content: utils.getApiMessage(project_uuid.error),
                    callbackFn: async () => {
                        history.replace("/dashboard");
                    }
                }));
                return;
            }

            const projectData = await dispatch(actions.fetchProjectById(project_uuid));

            setProjectUuid(project_uuid);
            setScanMode(projectData.scanMode);

            if(scanTaskId) {
                scanSummary = await dispatch(actions.fetchScanSummaryByScanId(scanTaskId, scanSummaryFilter));
            } else {
                scanSummary = await dispatch(actions.fetchScanSummaryByProjectUuid(project_uuid, scanSummaryFilter));
            }

            if(scanSummary.issueSummary && scanSummary.issueSummary.baselineScanTaskId) {
                await dispatch(actions.fetchScanSummaryByScanId(scanSummary.issueSummary.baselineScanTaskId, scanSummaryFilter, 'previous'));
            }

            if(scanSummary.error) {
                setIsLoading(false);
                dispatch(actions.pushAlert({
                    type: 'error',
                    title: i18n.t('common.notifications.failure'),
                    content: utils.getApiMessage(scanSummary.error),
                }));
                return;
            }

            setScanTaskId(scanSummary.scanTaskId);
            setProjectName(scanSummary.projectName);
            setIsLoading(false);
        })();
    }, [projectKey, _scanTaskId]);

    return <Container fluid className="scan-result-wrap">
        {isLoading && <Loader />}
        <Row>
            <Col>
                <Header 
                    isDsrPage={isDsrPage}
                    projectKey={projectKey}
                    projectUuid={projectUuid}
                    scanTaskId={scanTaskId}
                    projectName={projectName} 
                    scanMode={scanMode}
                    hasDsr={currentScanSummary && currentScanSummary.hasDsr}
                />
            </Col>
        </Row>
        <Row>
            <Col>
                <h2 className="project-name">{projectName || '-'}</h2>
            </Col>
        </Row>
        <Row>
            <Col>
                <ScanCharts
                    isDsrPage={isDsrPage}
                    scanMode={scanMode}
                    currentProjectSummary={currentProjectSummary}
                    previousProjectSummary={previousProjectSummary}
                />
            </Col>
        </Row>

        {
            projectUuid && scanTaskId && 
            <Switch>
                <Route exact path="/project/:projectKey">
                    <GeneralPage
                        projectKey={projectKey}
                        projectUuid={projectUuid}
                        scanTaskId={scanTaskId}
                        currentProjectSummary={currentProjectSummary}
                        isIgnoreView={isIgnoreView}
                        setIsIgnoreView={setIsIgnoreView}
                    />
                </Route>
                <Route exact path="/project/:projectKey/scans">
                    <DetailPage
                        projectKey={projectKey}
                        projectUuid={projectUuid}
                        scanTaskId={scanTaskId}
                        currentProjectSummary={currentProjectSummary}
                        isIgnoreView={isIgnoreView}
                        setIsIgnoreView={setIsIgnoreView}
                    />
                </Route>
                <Route exact path="/project/:projectKey/scan/:scanTaskId">
                    <DetailPage
                        projectKey={projectKey}
                        projectUuid={projectUuid}
                        scanTaskId={scanTaskId}
                        currentProjectSummary={currentProjectSummary}
                        isIgnoreView={isIgnoreView}
                        setIsIgnoreView={setIsIgnoreView}
                    />
                </Route>
            </Switch>
        }
    </Container>
}

export default ScanResult;