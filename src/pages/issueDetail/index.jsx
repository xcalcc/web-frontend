import React, {useState, useEffect, useMemo, useRef} from 'react';
import {useLocation} from 'react-router-dom';
import {Container, Row, Col} from 'react-bootstrap';
import {useSelector, useDispatch} from 'react-redux';
import i18n from 'i18next';
import enums from 'Enums';
import * as utils from 'Utils';
import * as actions from 'Actions';
import store from 'Store';
import BreadCrumbs from 'Components/BreadCrumbs';
import Loader from 'Components/Loader';
import PreviousNext from './_partials/PreviousNext';
import Header from './_partials/Header';
import Tabs from './_partials/Tabs';
import RuleView from './_partials/RuleView';
import AllPathView from './_partials/AllPathView';
import SourceCodeView from './_partials/SourceCodeView';

import './style.scss';

const IssueDetail = props => {
    const dispatch = useDispatch();
    const location = useLocation();

    const TABS_FIXED_COUNT = 2;
    const scanTaskId = props.match.params.scanTaskId;
    const projectKey = props.match.params.projectKey;
    const issueGroupId = props.match.params.issueGroupId;

    const issueDetailAction = actions.getPageActions('issueDetail');
    const activeTabId = useSelector(state => state.page.issueDetail.activeTabId);
    const tabsDataList = useSelector(state => state.page.issueDetail.tabsDataList);

    const [isLoading, setIsLoading] = useState(false);
    const [projectData, setProjectData] = useState({});
    const [issueList, setIssueList] = useState([]);
    const [issueGroupRuleSetCode, setIssueGroupRuleSetCode] = useState(null);
    const singleIssueGroupPageNumber = useSelector(state => state.page.issueDetail.singleIssueGroupPageNumber);

    const isDsrPage = /dsr=\w/.test(location.search);

    const getIssuePagingDataFromCacheData = () => {
        const issueDetailCacheData = utils.localStore.getDataRow(enums.ISSUE_DETAIL_CACHE_ID) || {};
        const _singleIssueGroupPageNumber = issueDetailCacheData.singleIssueGroupPageNumber;
        dispatch(issueDetailAction.setSingleIssueGroupPageNumber({
            scanTaskId,
            pageNumber: _singleIssueGroupPageNumber
        }));
    }

    const getFilterDataFromCacheData = () => {
        const currFilterCacheData = utils.scanResultHelper.getFilterDataFromCache({
            isMisraPage: enums.MISRA_RULE_SETS.includes(issueGroupRuleSetCode),
            isDsrPage,
            projectKey
        });
        dispatch(actions.getPageActions('scanResult').resetScanResultFilter(currFilterCacheData));
    }

    const breadcrumbs = useMemo(() => {
        let list = [];

        list.push({
            title: `${i18n.t('common.project')}:`,
            path: undefined
        });

        if(enums.MISRA_RULE_SETS.includes(issueGroupRuleSetCode)) {
            list.push({
                title: projectData.name || '',
                path: `/misra/project/${projectKey}`
            });

            if(isDsrPage) {
                list.push({
                    title: i18n.t('issueDetail.delta-view'),
                    path: `/misra/project/${projectKey}/scan/${scanTaskId}`
                });
            }
        } else {
            list.push({
                title: projectData.name || '',
                path: `/project/${projectKey}`
            });

            if(isDsrPage) {
                list.push({
                    title: i18n.t('issueDetail.delta-view'),
                    path: `/project/${projectKey}/scan/${scanTaskId}`
                });
            }
        }

        list.push({
            title: `${i18n.t('issueDetail.id')}: ${issueGroupId}`,
            path: undefined,
            current: true
        });

        if (utils.getAppFrom() === enums.APP_FROM.ANT) {
            list.forEach(item => item.path = undefined);
        }

        return list;
    }, [projectData.name, issueGroupId, issueGroupRuleSetCode, scanTaskId]);

    const showErrorMessage = error => {
        setIsLoading(false);
        dispatch(actions.pushAlert({
            type: 'error',
            title: i18n.t('common.notifications.failure'),
            content: utils.getApiMessage(error)
        }));
    };

    // used for class components (Graph is class component)
    const _getPageState = () => {
        return store.getState()['page'].issueDetail;
    }

    const onSelectedTab = tabId => {
        dispatch(issueDetailAction.setActiveTabId(tabId));
    }

    const onCloseTab = targetId => {
        const targetTabIndex = tabsDataList.findIndex(tab => tab.id === targetId);
        const newTabsDataList = tabsDataList.filter(tab => tab.id !== targetId);
        const previousTabId = newTabsDataList[targetTabIndex-1] && newTabsDataList[targetTabIndex-1].id;

        if(targetId === activeTabId) {
            dispatch(issueDetailAction.setActiveTabId(previousTabId));
        }
        dispatch(issueDetailAction.setTabsDataList(newTabsDataList));
    }

    const onAddTab = () => {
        let newTracePathIndex;

        // calculates the Index of the next trace path
        if(utils.isNumber(activeTabId)) {
            newTracePathIndex = activeTabId + 1;
        } else {
            newTracePathIndex = 0;
        }

        if(newTracePathIndex >= issueList.length) {
            return;
        }

        openAndActiveTab(newTracePathIndex);
    }

    const openAndActiveTab = tracePathIndex => {
        const pageState = _getPageState();
        const newTabsDataList = [...pageState.tabsDataList];
        // if Tab exists, activate it, if not, open a new Tab
        if(!newTabsDataList.find(tab => tab.id === tracePathIndex)) {
            const pathNum = tracePathIndex + 1;
            // the order of Tabs is in ascending order by path index
            let newTabIndex = newTabsDataList.findIndex(tab => tab.id > tracePathIndex);
            newTabIndex = newTabIndex === -1 ? newTabsDataList.length : newTabIndex;

            newTabsDataList.splice(newTabIndex, 0, {
                id: tracePathIndex,
                title: `${i18n.t('issueDetail.path')} #${pathNum}`,
                content: <SourceCodeView 
                            currentPathIndex={tracePathIndex}
                            onChangePathIndex={onChangeTracePathForCurrentTab}
                        />,
                closable: true,
            });
            dispatch(issueDetailAction.setTabsDataList(newTabsDataList));
        }

        dispatch(issueDetailAction.setActiveTabId(tracePathIndex));
    }

    const onChangeTracePathForCurrentTab = newTracePathIndex => {
        if(utils.isEmpty(newTracePathIndex) || newTracePathIndex === -1) return;

        const pageState = _getPageState();
        const newTabsDataList = [...pageState.tabsDataList];

        // if trace path exists in the Tabs, activate it, if not, update the current Tab content
        if(!newTabsDataList.find(tab => tab.id === newTracePathIndex)) {
            const currentTabIndex = newTabsDataList.findIndex(tab => tab.id === pageState.activeTabId);
            newTabsDataList[currentTabIndex] = {
                id: newTracePathIndex,
                title: `${i18n.t('issueDetail.path')} #${newTracePathIndex + 1}`,
                content: <SourceCodeView 
                    currentPathIndex={newTracePathIndex}
                    onChangePathIndex={onChangeTracePathForCurrentTab}
                />,
                closable: true
            };
            dispatch(issueDetailAction.setTabsDataList(newTabsDataList));
        }
        dispatch(issueDetailAction.setActiveTabId(newTracePathIndex));
    }

    const loadIssueData = async (projectUuid) => {
        const issueGroup = await dispatch(actions.fetchIssueGroupById(scanTaskId, issueGroupId));
        const ruleInfo = dispatch(actions.getRuleInfoByCsvCode(issueGroup.ruleCode));

        const _scanTaskId = issueGroup.dsr === enums.DSR_TYPE.FIXED ? issueGroup.occurScanTaskId : scanTaskId;
        const _issueList = await dispatch(actions.fetchIssueListByGroupId(_scanTaskId, issueGroup, ruleInfo.msg_templ));

        const error = issueGroup.error || _issueList.error;

        if(error) {
            showErrorMessage(error);
            return;
        }

        setIssueList(_issueList);
        setIssueGroupRuleSetCode(issueGroup.ruleSet);
    }

    const useDidUpdateEffect = (fn, inputs) => {
        const didMountRef = useRef(false);
        useEffect(() => {
            if (didMountRef.current) {
                fn();
            } else {
                didMountRef.current = true;
            }
        }, inputs);
    }

    useEffect(() => {
        getIssuePagingDataFromCacheData();
        getFilterDataFromCacheData();
    }, [issueGroupRuleSetCode]);

    useEffect(() => {
        if(!issueList || issueList.length === 0) return;

        // for SourceCodeView Tab, the Tab id will use the trace path index
        const initialTabs = [
            {
                id: 'defect-info',
                title: i18n.t('issueDetail.defect-info'),
                content: <RuleView/>,
                closable: false,
            },
            {
                id: 'all-paths',
                title: i18n.t('issueDetail.all-paths'),
                content: <AllPathView onTracePathClick={openAndActiveTab} />,
                closable: false,
            }
        ];

        const shortestPathIndex = issueList.reduce((index, currData, currIndex) => {
            let shortest = index;
            if(currData.tracePath.length < issueList[index].tracePath.length) {
                shortest = currIndex;
            }
            return shortest;
        }, 0);

        dispatch(issueDetailAction.setTabsDataList(initialTabs));
        openAndActiveTab(shortestPathIndex);
    }, [issueGroupId, issueList /* when click the previous or next issue, reset Tabs*/]);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const projectUuid = await dispatch(actions.fetchProjectUuid(projectKey));

            const error = projectUuid.error;

            if(error) {
                showErrorMessage(error);
                return;
            }

            const _projectData = await dispatch(actions.fetchProjectById(projectUuid));

            await dispatch(actions.fetchUserConfig());
            await dispatch(actions.fetchPathMsg());
            await dispatch(actions.fetchStandards());
            await dispatch(actions.fetchRuleList());
            await dispatch(actions.fetchCustomRuleMap(_projectData.projectId));
            await loadIssueData(projectUuid);

            setProjectData(_projectData);
            setIsLoading(false);
        })();
    }, []);

    useDidUpdateEffect(() => {
        if(utils.isEmpty(singleIssueGroupPageNumber) || utils.isEmpty(projectData.id)) return;
        (async () => {
            setIsLoading(true);
            await loadIssueData(projectData.id);
            setIsLoading(false);
        })();
    }, [singleIssueGroupPageNumber]);

    const isShowAddButton = tabsDataList && (tabsDataList.length-TABS_FIXED_COUNT < issueList.length);

    return <Container fluid className="issue-detail-page">
        {
            isLoading && <Loader/>
        }
        <div className="topbar">
            <Row>
                <Col>
                    <BreadCrumbs data={breadcrumbs} />
                </Col>
                {
                    utils.getAppFrom() !== enums.APP_FROM.ANT &&
                    <Col>
                        <PreviousNext scanTaskId={scanTaskId}/>
                    </Col>
                }
            </Row>
        </div>
        <Row>
            <Col>
                <Header />
            </Col>
        </Row>
        <Row>
            <Col>
                <Tabs
                    activeId={activeTabId}
                    onChange={onSelectedTab}
                    onAdd={onAddTab}
                    onClose={onCloseTab}
                    tabsDataList={tabsDataList}
                    isShowAddButton={isShowAddButton}
                />
            </Col>
        </Row>
    </Container>;
}

export default IssueDetail;