import React, {useState} from "react";
import useDeepCompareEffect from 'use-deep-compare-effect';
import classNames from "classnames";
import i18n from "i18next";
import moment from 'moment';
import produce from "immer";
import {useHistory} from "react-router-dom";
import {PersonCircle, PersonPlusFill} from 'react-bootstrap-icons';
import {Badge} from "react-bootstrap";
import {useSelector, useDispatch} from "react-redux";
import * as actions from 'Actions';
import Loader from 'Components/Loader';
import DropDownWithTitle from "Components/DropdownWithTitle";
import CopyIcon from 'Components/CopyIcon';
import * as utils from "Utils";
import enums from 'Enums';
import Pagination from 'Components/Pagination';

import './style.scss';

const IssueTable = props => {
    const {
        projectKey,
        scanTaskId,
        title,
        dsrType,
        isDsrPage,
        issueGroupType = enums.ISSUE_GROUP_TYPE.GENERAL
    } = props;

    const history = useHistory();
    const dispatch = useDispatch();

    const userList = useSelector(state => state.user.userList);
    const projectData = useSelector(state => state.project.projectData);
    const currentFilter = useSelector(state => state.page.scanResult.filter);
    const currentPaging = useSelector(state => state.page.scanResult[issueGroupType].paging);

    const isEnglish = utils.isEnglish();
    const [isLoading, setIsLoading] = useState(false);
    const totalIssues = useSelector(state => state.page.scanResult[issueGroupType].paging.totalIssues);
    const totalPages = useSelector(state => state.page.scanResult[issueGroupType].paging.totalPages);
    const issueList = useSelector(state => state.page.scanResult[issueGroupType].data);
    const issueGroupListData = useSelector(state => state.page.scanResult[issueGroupType]);
    const enableApi = useSelector(state => state.page.scanResult.enableApi);

    const onPageChange = pageNumber => {
        dispatch(actions.getPageActions('scanResult').setIssuePaging(issueGroupType, {
            ...currentPaging,
            currentPage: pageNumber
        }));
    }

    const onPageSizeChange = pageSize => {
        dispatch(actions.getPageActions('scanResult').setIssuePaging(issueGroupType, {
            ...currentPaging,
            currentPage: 1,
            pageSize: pageSize
        }));
    }

    const getSingleIssueGroupRowIndexInTable = issueGroupId => {
        const indexInCurrentPage = issueList.findIndex(x => x.id === issueGroupId);
        if(indexInCurrentPage === -1) return 0;

        // Calculate page index
        return (currentPaging.currentPage - 1) * currentPaging.pageSize + indexInCurrentPage;
    }

    const getParentElements = (elem, until) => {
        let matched = [];
        let cur = elem.parentNode;

        until = until || 'html';

        while (cur && cur.nodeType !== 9 && cur !== document.querySelector(until)) {
            if (cur.nodeType === 1) {
                matched.push(cur);
            }
            cur = cur.parentNode;
        }
        return matched;
    }


    // Below is old table component
    const handleRowClick = (event, issue) => {
        const classname = String(event.target.className);
        let parents = getParentElements(event.target, 'table.data-table');
        parents = parents.filter(x => String(x.className).indexOf("no_clickable") > -1);

        if (
            classname.indexOf("no_clickable") === -1 &&
            classname.indexOf("dropdown-item") === -1 &&
            parents.length === 0
        ) {
            const pageIndex = getSingleIssueGroupRowIndexInTable(issue.id);
            const pageNumber = pageIndex + 1;

            dispatch(actions.getPageActions('issueDetail').setSingleIssueGroupPageNumber({
                scanTaskId,
                pageNumber
            }));

            if(dsrType) {
                history.push(`/project/${projectKey}/scan/${scanTaskId}/issue/${issue.id}?dsr=${issue.dsr}`);
            } else {
                history.push(`/project/${projectKey}/scan/${scanTaskId}/issue/${issue.id}`);
            }
        }
    }

    const handleAssignIssueToUser = async (issueGroupId, userId, displayName, assigneeId) => {
        if(userId === assigneeId) return;
        const assignResult = await dispatch(actions.assignIssueToUser(issueGroupId, userId));

        if(assignResult.error) {
            dispatch(actions.pushAlert({
                type: 'error',
                title: i18n.t('common.notifications.failure'),
                content: utils.getApiMessage(assignResult.error)
            }));
            return;
        }

        const _issueList = produce(issueList, draft => {
            draft.forEach(issue => {
                if (issue.id === issueGroupId) {
                    issue.assigneeId = userId;
                    issue.assigneeDisplayName = displayName;
                }
            });
        })

        dispatch(actions.getPageActions('scanResult').setScanResultIssueGroupData(issueGroupType, {
            ...issueGroupListData,
            data: [..._issueList]
        }));
    }

    const getFirstColumn = issue => {
        return <div className={classNames('label-flag', {
                high: issue.criticality === enums.ISSUE_CRITICALITY.high,
                medium: issue.criticality === enums.ISSUE_CRITICALITY.medium,
                low: issue.criticality === enums.ISSUE_CRITICALITY.low,
                certainty: issue.certainty === enums.ISSUE_CERTAINTY.D
            })}>
            &nbsp;
        </div>;
    }
  
    const getTableHead = () => {
        let headRows = [
            {field: 'ruleInformation.priority,ruleInformation.certainty', label: '', isSort: true},
            {field: 'seq', label: utils.language("id"), isSort: true},
            {field: 'ruleInformation.vulnerable', label: utils.language("table_title_type"), isSort: true},
            {field: 'ruleInformation.name', label: utils.language("description"), isSort: true},
            {field: 'standard', label: i18n.t("pages.scan-result.issue-table.rule-standard"), isSort: false},
            {field: 'scanFile.projectRelativePath', label: utils.language("file"), isSort: true},
            {field: 'lineNo', label: utils.language("line"), isSort: false},
            {field: 'functionName', label: utils.language("function"), isSort: true},
            {field: 'variableName', label: utils.language("VARIABLE"), isSort: true},
            {field: 'numberOfPath', label: utils.language("paths2"), isSort: false},
            {
                field: 'dsr',
                label: dsrType === enums.DSR_TYPE.FIXED ? i18n.t('pages.dsr.fixed-time') : i18n.t('pages.dsr.detected-time'),
                isShow: !!dsrType
            },
            {field: 'assignTo.displayName', label: i18n.t('pages.scan-result.issue-table.assignee'), isSort: true}
        ];

        return (
            <thead>
            <tr>
                {headRows.filter(x => x.isShow || x.isShow === undefined).map(row => (
                    <th key={row.field}>
                        {row.label}
                    </th>
                ))}
            </tr>
            </thead>
        );
    }
 
    const getAssignIssueTd = issue => {
        const menus = userList.map(user => ({
            label: user.displayName,
            value: '',
            onSelect: () => handleAssignIssueToUser(issue.id, user.id, user.displayName, issue.assigneeId)
        }));

        return <td className="no_clickable">
            <DropDownWithTitle 
                menuGroups={[
                    {
                        menus: menus
                    }
                ]}
                label={issue.assigneeDisplayName || i18n.t('pages.dsr.issue-table.unassigned')}
                icon={issue.assigneeDisplayName ? <PersonCircle /> : <PersonPlusFill />}
            />
        </td>;
    }

    const getDsrTime = issue => {
        let format = isEnglish ? 'DD/MM/YYYY HH:mm:ss' : 'YYYY/MM/DD HH:mm:ss';
        let time = dsrType === enums.DSR_TYPE.FIXED ? issue.fixedTime : issue.occurTime;
        let timeMoment = moment(Number(time) || null);
        return timeMoment.isValid() ? timeMoment.format(format) : '-';
    }

    const getCopyButtonTipMsg = issue => {
        const projectConfig = projectData.projectConfig || {};
        const sourceCodePath = projectConfig.relativeSourcePath || '';
        const fileRelativePath = issue.sinkRelativePath || issue.srcRelativePath || '';

        return sourceCodePath + '/' + fileRelativePath;
    }

    useDeepCompareEffect(() => {
        if(!enableApi) {
            return;
        }
        (async () => {
            const payload = dispatch(actions.getPayloadOfSearchIssue({
                isDsrPage,
                isMisraPage: false,
                scanTaskId,
                currentFilter,
                pageNumber: currentPaging.currentPage,
                pageSize: currentPaging.pageSize
            }));

            if(isDsrPage) {
                payload.dsrType = Array.isArray(dsrType) ? dsrType : [dsrType];
            }

            setIsLoading(true);
            const response = await dispatch(actions.searchIssueGroup(payload));
            setIsLoading(false);

            if(response.error) {
                dispatch(actions.pushAlert({
                    type: 'error',
                    title: i18n.t('common.notifications.failure'),
                    content: utils.getApiMessage(response.error)
                }));
                dispatch(actions.getPageActions('scanResult').resetScanResultIssueGroupData(issueGroupType));
                return;
            }

            dispatch(actions.getPageActions('scanResult').setScanResultIssueGroupData(issueGroupType, {
                paging: {
                    currentPage: response.number + 1,
                    pageSize: currentPaging.pageSize,
                    totalPages: response.totalPages,
                    totalIssues: response.totalElements
                },
                data: response.content
            }));
        })();

    }, [scanTaskId, currentFilter, currentPaging.currentPage, currentPaging.pageSize]);

    return (
        <div className="issue-table-wrap">
            {isLoading && <Loader />}
            <p className="total">
                {title && `${title} (${utils.formatNumber(totalIssues)})`}
            </p>
            {
                issueList && issueList.length > 0 &&
                <table className="data-table">
                    {getTableHead()}
                    <tbody className="scroll">
                        {/* <Scrollbar> */}
                            {issueList.map((issue, index) => (
                                <tr
                                    onClick={event => handleRowClick(event, issue)}
                                    key={issue.id}
                                >
                                    <td className="red-txt">
                                        {getFirstColumn(issue)}
                                    </td>
                                    <td>
                                        <span>{issue.id}</span>
                                    </td>
                                    <td>
                                        <span>{utils.scanResultHelper.getRuleInfo(issue.ruleCode).code || issue.ruleCode}</span>
                                    </td>
                                    <td>
                                        <span>{utils.scanResultHelper.getRuleInfo(issue.ruleCode).name || '-'}</span>
                                    </td>
                                    <td>
                                        {utils.scanResultHelper
                                            .getStandardAndRuleSetNames(issue.ruleCode)
                                            .map((x, idx) => <Badge key={idx} variant="secondary">
                                                                    {x.toUpperCase()}
                                                                </Badge>)} 
                                    </td>
                                    <td>
                                        <span>
                                            {issue.sinkRelativePath || issue.srcRelativePath || '-'}
                                            <CopyIcon 
                                                copyText={getCopyButtonTipMsg(issue)}
                                                tipMessage={i18n.t('pages.scan-result.tooltip.copy-full-path-tip')}
                                            />
                                        </span>
                                    </td>
                                    <td>
                                        <span>{utils.formatNumber(issue.sinkLineNo || issue.srcLineNo) || '-'}</span>
                                    </td>
                                    <td>
                                        <span>{issue.functionName || "-"}</span>
                                    </td>
                                    <td>
                                        <span>{issue.variableName || "-"}</span>
                                    </td>
                                    <td>
                                        <div className="circle-paths">
                                            <span>{issue.issueCount}</span>
                                        </div>
                                    </td>
                                    {
                                        !!dsrType && 
                                        <td>
                                            <span>{getDsrTime(issue)}</span>
                                        </td>
                                    }

                                    {getAssignIssueTd(issue)}
                                </tr>
                            ))}
                        {/* </Scrollbar> */}
                    </tbody>
                </table>
            }
            {
                issueList && issueList.length === 0 &&
                <p className="norecord">{i18n.t('common.table-no-data')}</p>
            }
            {
                totalPages > 0 &&
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPaging.currentPage}
                    pageSize={currentPaging.pageSize}
                    onPageChange={onPageChange}
                    onPageSizeChange={onPageSizeChange}
                />
            }
        </div>
    );
}
 
export default IssueTable;