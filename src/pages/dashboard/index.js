import React, {useState, useEffect} from "react";
import {Container, Row, Col} from 'react-bootstrap';
import {useDispatch, useSelector, shallowEqual} from "react-redux";
import {useHistory} from 'react-router-dom';
import classNames from "classnames";
import moment from 'moment';
import * as utils from "Utils";
import * as actions from 'Actions';
import i18n from 'i18next';
import FuzzySearch from 'fuzzy-search';
import Loader from 'Components/Loader';
import ConfirmPrompt from 'Containers/ConfirmPrompt';
import enums from 'Common/enumeration';
import Header from "./_partials/header";
import Toolbar from "./_partials/toolBar";
import BlockList from "./_partials/blockList";
import ListTable from "./_partials/listTable";
import Subscribe from "./subscribe";

import './index.scss';

const DEFAULT_SORT_FIELD = "scanTime";

const Dashboard = props => {
    const [sorting, setSorting] = useState({
        sortField: DEFAULT_SORT_FIELD,
        sortDirection: -1
    });
    const [tableView, setTableView] = useState(enums.TABLE_VIEW_TYPE.BLOCK);
    const [currentProjectId, setCurrentProjectId] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [isAlertOn, setIsAlertOn] = useState(false);
    const projectListWithSummary = useSelector(state => state.project.projectList, shallowEqual);
    const [projectList, setProjectList] = useState(projectListWithSummary);
    const [sseSuccessfulScanTaskId, setSseSuccessfulScanTaskId] = useState();
    const [sseSubscribe, setSseSubscribe] = useState();
    const [dashboardContent, setDashboardContent] = useState(null);

    const dispatch = useDispatch();
    const history = useHistory();
    const dateFormat = utils.isEnglish() ? 'DD/MM/YYYY' : 'YYYY/MM/DD';

    const searcher = new FuzzySearch(projectListWithSummary, ['name'], {
        caseSensitive: false,
    });
    const handleSearch = searchWord => {
        setLoading(true);

        let filtered, sorted;
        if (!!searchWord) {
            filtered = searcher.search(searchWord);
            sorted = utils.sort.sortByName(filtered);
        } else {
            sorted = utils.sort.sortByName(projectListWithSummary);
        }

        setLoading(false);

        setProjectList(sorted);
    };
    const handleSorting = (sortMethod, direction) => {
        setSorting({
            sortField: sortMethod,
            sortDirection: direction
        });
    }
    const selectViewMode = tableView => {
        setTableView(tableView);
    }
    const handleProjectClick = (event, projectUuid, isSelectedMisra) => {
        if (event && event.stopPropagation) {
            event.stopPropagation();
        }

        const projectData = projectListWithSummary.find(x => x.id === projectUuid) || {};
        const ruleSetSummaryMap = (projectData.summary && projectData.summary.ruleSetSummaryMap) || {};
        const issuesCount = ruleSetSummaryMap['all'] && ruleSetSummaryMap['all'].issuesCount;
        if(issuesCount !== null && issuesCount !== undefined) {
            if(projectData.scanMode === enums.SCAN_MODE.XSCA || isSelectedMisra) {
                history.push("/misra/project/" + projectData.projectId);
            } else {
                history.push("/project/" + projectData.projectId);
            }
        }
    }
    const handleGotoDsrPage = (event, projectUuid, isSelectedMisra) => {
        if (event && event.stopPropagation) {
            event.stopPropagation();
        }

        const projectData = projectListWithSummary.find(x => x.id === projectUuid) || {};
        if(projectData.scanMode === enums.SCAN_MODE.XSCA || isSelectedMisra) {
            history.push(`/misra/project/${projectData.projectId}/scans`);
        } else {
            history.push(`/project/${projectData.projectId}/scans`);
        }
    }
    const handleDeleteProject = (event, projectId) => {
        if (event && event.stopPropagation) {
            event.stopPropagation();
        }
        setIsAlertOn(true);
        setCurrentProjectId(projectId);
    }
    const handleViewScanRecord = (event, projectId) => {
        if (event && event.stopPropagation) {
            event.stopPropagation();
        }

        history.push(`/project/${projectId}/scan-list`);
    }
    const handleViewSetting = (event, projectId) => {
        if (event && event.stopPropagation) {
            event.stopPropagation();
        }

        history.push(`/project-setting/${projectId}`);
    }
    const deleteProject = async () => {
        const result = await dispatch(actions.deleteProject(currentProjectId));
        if(result.status === 204) {
            const newProjectList = projectList.filter(project => project.id !== currentProjectId);
            const newProjectListWithSummary = projectListWithSummary.filter(project => project.id !== currentProjectId);

            setProjectList(newProjectList);
            dispatch(actions.setProjectList(newProjectListWithSummary));

            dispatch(actions.pushAlert({
                type: 'message',
                title: i18n.t('common.notifications.success'),
                content: i18n.t('common.notifications.delete-success')
            }));
        } else {
            dispatch(actions.pushAlert({
                type: 'error',
                title: i18n.t('common.notifications.failure'),
                content: i18n.t('common.notifications.delete-failure')
            }));
        }
        setIsAlertOn(false);
        setCurrentProjectId(null);
    }

    const subscribeScanStatus = projectSummaryList => {
        if(sseSubscribe) return;
        const _sseSubscribe = new Subscribe({
            projectList: projectSummaryList,
            setProjectList: (projectlist) => {
                setProjectList(JSON.parse(JSON.stringify(projectlist)));
            },
            setSseSuccessfulScanTaskId: (scanTaskId) => {
                setSseSuccessfulScanTaskId(scanTaskId);
            }
        });
        _sseSubscribe.start();

        setSseSubscribe(_sseSubscribe);
    }

    const formatProjectData = project => {
        if(!project.summary) return project;
        const lastScanTask = project.lastScanTask || {};
        const scanEndMomentEntity = moment(Number(project.summary.scanEndAt || project.summary.scanStartAt) || null);
        project.summary.scanDate = (scanEndMomentEntity.isValid() && scanEndMomentEntity.format(dateFormat)) || '';
        project.summary.scanTime = (scanEndMomentEntity.isValid() && scanEndMomentEntity.format('HH:mm:ss')) || '';
        project.scanTime = Number(project.summary.scanEndAt) || 0;
        project.scanModeText = i18n.t(`common.scan-mode.${project.scanMode || enums.SCAN_MODE.SINGLE}`);
        project.summary.langList = (project.summary.langList && project.summary.langList.split(',')) || [];
        project.summary.finishLoading = true;

        if([enums.SCAN_TASK_STATUS.pending, enums.SCAN_TASK_STATUS.processing].includes(lastScanTask.status)) {
            project.isScanning = true;
            project.scanningStatus = null;
        } else {
            project.isScanning = false;
            project.scanningStatus = null;
        }

        return project;
    }

    useEffect(() => {
        (async () => {
            setLoading(true);
            const projectListWithSummary = await dispatch(actions.fetchProjectListV3());
            projectListWithSummary.forEach(project => formatProjectData(project));
            setProjectList(projectListWithSummary);
            setLoading(false);
        })();
    }, []);

    useEffect(() => {
        if(!sseSuccessfulScanTaskId) return;
        (async () => {
            const projectListWithSummary = await dispatch(actions.fetchProjectListV3());
            let project = projectListWithSummary.find(x => (x.lastScanTask && x.lastScanTask.id) === sseSuccessfulScanTaskId);
            if(!project) return;

            project = formatProjectData(project);

            for(let i=0; i < projectList.length; i++) {
                if(projectList[i].id === project.id) {
                    projectList[i] = project;
                    break;
                }
            }

            setProjectList(JSON.parse(JSON.stringify(projectList)));
        })();
    }, [sseSuccessfulScanTaskId]);

    useEffect(() => {
        if(projectList && projectList.length > 0) {
            subscribeScanStatus(projectList);
        }
        return () => sseSubscribe && sseSubscribe.close();
    }, [projectList]);

    const resultNotFound = <div className="no-data">
        {i18n.t("Search result not found")}
    </div>;

    useEffect(() => {
        const iconView = <BlockList
            sorting={sorting}
            onSort={handleSorting}
            isLoading={isLoading}
            searchQueryList={projectList}
            onProjectClick={handleProjectClick}
            onGotoDsrPage={handleGotoDsrPage}
            onDeleteProject={handleDeleteProject}
            onViewScanRecord={handleViewScanRecord}
            onViewSetting={handleViewSetting}
        />;
        const listView = <ListTable
            onSort={handleSorting}
            sorting={sorting}
            isLoading={isLoading}
            tableData={projectList}
            onProjectClick={handleProjectClick}
            onGotoDsrPage={handleGotoDsrPage}
            onDeleteProject={handleDeleteProject}
            onViewScanRecord={handleViewScanRecord}
        />;
        if (!!projectList && projectList.length > 0) {
            const content = (tableView === enums.TABLE_VIEW_TYPE.BLOCK ? iconView : listView);
            setDashboardContent(content);
        } else {
            const content = isLoading ? null : resultNotFound;
            setDashboardContent(content);
        }

    }, [tableView, sorting, projectList, isLoading]);

    return <Container fluid className={classNames('dashboard', {
        "dashboard-box-page": tableView === enums.TABLE_VIEW_TYPE.BLOCK,
        "dashboard-list-page": tableView !== enums.TABLE_VIEW_TYPE.BLOCK
    })}>
        {
            isLoading && <Loader/>
        }
        <Container fluid className="dashboard-wrapper noPadding">
            <Row>
                <Col>
                    <Header
                        tableView={tableView}
                        onSelectViewMode={selectViewMode}
                        onSearch={handleSearch}
                    />
                </Col>
            </Row>
            <Row noGutters>
                <Col className="tool-bar-wrapper">
                    <Toolbar
                        projectCount={projectList && projectList.length}
                        sorting={sorting}
                        onSort={handleSorting}
                    />
                </Col>
            </Row>
            <Row noGutters className="dashboard-table">
                {dashboardContent}
            </Row>
        </Container>
        <ConfirmPrompt
            show={isAlertOn}
            title={i18n.t('common.are-you-sure')}
            cancelBtnText={i18n.t('common.buttons.cancel')}
            confirmBtnText={i18n.t('common.delete-it')}
            contentText={i18n.t('common.delete-tip')}
            onConfirm={deleteProject}
            onCancel={() => setIsAlertOn(false)}
            onHide={() => setIsAlertOn(false)}
        />

    </Container>;
}

export default Dashboard;
