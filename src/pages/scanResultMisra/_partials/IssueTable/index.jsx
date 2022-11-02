import React, {useState} from "react";
import useDeepCompareEffect from 'use-deep-compare-effect';
import classNames from "classnames";
import i18n from "i18next";
import moment from 'moment';
import produce from "immer";
import {useHistory} from "react-router-dom";
import {PersonCircle, PersonPlusFill} from 'react-bootstrap-icons';
import {useSelector, useDispatch} from "react-redux";
import * as actions from 'Actions';
import Loader from 'Components/Loader';
import DropDownWithTitle from "Components/DropdownWithTitle";
import ConfirmPrompt from 'Containers/ConfirmPrompt';
import CopyIcon from 'Components/CopyIcon';
import * as utils from "Utils";
import enums from 'Enums';
import Pagination from 'Components/Pagination';
import MultipleSelectionTips from 'Pages/scanResult/_partials/IssueTable/MultipleSelectionTips';
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

    const CHECK_ALL_STATUS = {
        DISABLE: 'disable',
        CHECKED_ALL: 'checked',
        NON_CHECKED_ALL: 'non-checked',
    };
    const TEMP_MULTIPLE_SELECTION_DATA_TYPE = {
        CHECK_ROW: 0,
        ASSIGNEE: 1,
        VALIDATION: 2
    };

    const history = useHistory();
    const dispatch = useDispatch();

    const userList = useSelector(state => state.user.userList);
    const projectData = useSelector(state => state.project.projectData);
    const currentFilter = useSelector(state => state.page.scanResult.filter);
    const currentPaging = useSelector(state => state.page.scanResult[issueGroupType].paging);

    const isEnglish = utils.isEnglish();
    const [isLoading, setIsLoading] = useState(false);
    const [isShowDialog, setIsShowDialog] = useState(false);
    const [checkAllStatus, setCheckAllStatus] = useState(CHECK_ALL_STATUS.DISABLE);
    const [tempMultipleSelectionData, setTempMultipleSelectionData] = useState({
        checkedIssueIds: [],
        assignee: {/*assigneeId, assigneeDisplayName*/}, 
        validation: '',
    });
    const [selectedValidation, setSelectedValidation] = useState({
        currIssueGroupId: '', 
        newValidation: '',
        tooltip: ''
    });
    const totalIssues = useSelector(state => state.page.scanResult[issueGroupType].paging.totalIssues);
    const totalPages = useSelector(state => state.page.scanResult[issueGroupType].paging.totalPages);
    const issueList = useSelector(state => state.page.scanResult[issueGroupType].data);
    const issueGroupListData = useSelector(state => state.page.scanResult[issueGroupType]);
    const enableApi = useSelector(state => state.page.scanResult.enableApi);
    const isReloadIssueGroupList = useSelector(state => state.page.scanResult.isReloadIssueGroupList);

    const updateTempMultipleSelectionData = (operationType, {
        currIssueId,
        newUserId,
        newUserDisplayName,
        newValidation
    }) => {
        let tempData = {...tempMultipleSelectionData};

        const hasIncludedIssueId = tempData.checkedIssueIds.includes(currIssueId);
        if(!hasIncludedIssueId) {
            tempData.checkedIssueIds.push(currIssueId);
        }

        switch(operationType) {
            case TEMP_MULTIPLE_SELECTION_DATA_TYPE.CHECK_ROW:
                // check or uncheck. if id does not exist, add it, if id exists, delete it
                if(hasIncludedIssueId) {
                    tempData.checkedIssueIds.splice(tempData.checkedIssueIds.indexOf(currIssueId), 1);
                }
                if(tempData.checkedIssueIds.length === 0) {
                    tempData.assignee = {};
                    tempData.validation = '';
                }
                break;

            case TEMP_MULTIPLE_SELECTION_DATA_TYPE.ASSIGNEE:
                tempData.assignee = {
                    assigneeId: newUserId,
                    assigneeDisplayName: newUserDisplayName
                };
                break;

            case TEMP_MULTIPLE_SELECTION_DATA_TYPE.VALIDATION:
                tempData.validation = newValidation;
                break;
            default:
                break;
        }

        setTempMultipleSelectionData(tempData);

        return tempData;
    }

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

    // Below is old table component
    const handleRowClick = (event, issue) => {
        const classname = String(event.target.className);
        let parents = utils.getParentElements(event.target, 'table.data-table');
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

        // for multiple selection
        if(checkAllStatus === CHECK_ALL_STATUS.NON_CHECKED_ALL || checkAllStatus === CHECK_ALL_STATUS.CHECKED_ALL) {
            updateTempMultipleSelectionData(TEMP_MULTIPLE_SELECTION_DATA_TYPE.ASSIGNEE, {
                currIssueId: issueGroupId,
                newUserId: userId,
                newUserDisplayName: displayName,
            });
            return;
        }

        // for single issue
        const assignResult = await dispatch(actions.assignIssueToUser(issueGroupId, userId));

        if(assignResult.error) {
            dispatch(actions.pushAlert({
                type: 'error',
                title: i18n.t('common.notifications.failure'),
                content: utils.getApiMessage(assignResult.error)
            }));
            return;
        }

        const newIssueList = produce(issueList, draft => {
            draft.forEach(issue => {
                if (issue.id === issueGroupId) {
                    issue.assigneeId = userId;
                    issue.assigneeDisplayName = displayName;
                }
            });
        })

        dispatch(actions.getPageActions('scanResult').setScanResultIssueGroupData(issueGroupType, {
            ...issueGroupListData,
            data: [...newIssueList]
        }));
    }

    const onSelectValidation = (currIssueGroupId, currValidation, newValidation) => {
        if(newValidation === currValidation) return;

        // for multiple selection
        if(checkAllStatus === CHECK_ALL_STATUS.NON_CHECKED_ALL || checkAllStatus === CHECK_ALL_STATUS.CHECKED_ALL) {
            updateTempMultipleSelectionData(TEMP_MULTIPLE_SELECTION_DATA_TYPE.VALIDATION, {
                currIssueId: currIssueGroupId.id, 
                newValidation
            });
            return;
        }

        // for single issue
        let i18nKey = newValidation === enums.ISSUE_VALIDATION_ACTION.IGNORE
                    ? 'pages.scan-result.tooltip.modify-validation-ignore'
                    : 'pages.scan-result.tooltip.modify-validation-nonignore';

        if(!utils.isEnableDevModeOption(enums.DEV_MODE_OPTION.validation)) {
            i18nKey = 'pages.scan-result.tooltip.modify-validation-nonignore';
        }

        setSelectedValidation({
            currIssueGroupId, 
            newValidation,
            tooltip: i18n.t(i18nKey, {
                currValidation: i18n.t(`pages.scan-result.validation.${currValidation}`),
                newValidation: i18n.t(`pages.scan-result.validation.${newValidation}`),
                issueGroupId: currIssueGroupId
            })
        });
        setIsShowDialog(true);
    }

    const updateValidation = async () => {
        const {
            currIssueGroupId,
            newValidation
        } = selectedValidation;

        setIsLoading(true);
        setIsShowDialog(false);

        const currIssue = issueList.find(x => x.id === currIssueGroupId) || {};

        const defaultValidation = currIssue.validations && 
                currIssue.validations.find(x => x.type === enums.ISSUE_VALIDATION_TYPE.DEFAULT);

        let responseData;
        let deletedValidation = false;
        if(!defaultValidation) {
            responseData = await dispatch(actions.addIssueValidation({
                projectId: currIssue.projectId,
                scanTaskId: currIssue.occurScanTaskId,
                ruleCode: currIssue.ruleCode,
                filePath: currIssue.sinkRelativePath || currIssue.srcRelativePath,
                functionName: currIssue.functionName,
                variableName: currIssue.variableName,
                type: enums.ISSUE_VALIDATION_TYPE.DEFAULT,
                action: newValidation,
                scope: enums.ISSUE_VALIDATION_SCOPE.GLOBAL
            }));
        } else if(newValidation === enums.ISSUE_VALIDATION_ACTION.UNDECIDED) {
            deletedValidation = true;
            responseData = await dispatch(actions.deleteIssueValidation(defaultValidation.id));
        } else {
            responseData = await dispatch(actions.updateIssueValidation({
                id: defaultValidation.id,
                action: newValidation
            }));
        }

        setIsLoading(false);

        if(responseData.error) {
            dispatch(actions.pushAlert({
                type: 'error',
                title: i18n.t('common.notifications.failure'),
                content: utils.getApiMessage(responseData.error)
            }));
            return;
        }

        const isIgnoreTable = issueGroupType === enums.ISSUE_GROUP_TYPE.IGNORE;
        if(isIgnoreTable || newValidation === enums.ISSUE_VALIDATION_ACTION.IGNORE) {
            // call the API again to modify the data. move data from the current table to another table.
            dispatch(actions.getPageActions('scanResult').isReloadIssueGroupList(Math.random()));
        } else {
            // modify the data directly on the front end
            const newIssueList = produce(issueList, draft => {
                draft.forEach(issue => {
                    if (issue.id === currIssue.id) {
                        issue.validations = issue.validations || [];
                        // the issue group has only one DEFAULT validation
                        issue.validations = issue.validations.filter(x => x.type !== enums.ISSUE_VALIDATION_TYPE.DEFAULT);
                        !deletedValidation && issue.validations.push(responseData);
                    }
                });
            });

            dispatch(actions.getPageActions('scanResult').setScanResultIssueGroupData(issueGroupType, {
                ...issueGroupListData,
                data: [...newIssueList]
            }));
        }
    }

    const gotoCustomFilter = (issue) => {
        const ruleInfo = utils.scanResultHelper.getRuleInfo(issue.ruleCode);
        const params = {
            projectId: projectData.id,
            scanTaskId,
            ruleCode: ruleInfo.code,
            filePath: issue.sinkRelativePath || issue.srcRelativePath,
            functionName: issue.functionName,
            variableName: issue.variableName
        };
        history.push(`/setting/issue-filters?${new URLSearchParams(params).toString()}`);
    }

    const onCheckAll = () => {
        const prevCheckAllStatus = checkAllStatus;

        switch(prevCheckAllStatus) {
            case CHECK_ALL_STATUS.DISABLE:
                setCheckAllStatus(CHECK_ALL_STATUS.NON_CHECKED_ALL);
                break;

            case CHECK_ALL_STATUS.NON_CHECKED_ALL:
                setCheckAllStatus(CHECK_ALL_STATUS.CHECKED_ALL);
                setTempMultipleSelectionData({
                    ...tempMultipleSelectionData,
                    checkedIssueIds: issueList.map(issue => issue.id)
                });
                break;

            case CHECK_ALL_STATUS.CHECKED_ALL:
                setCheckAllStatus(CHECK_ALL_STATUS.NON_CHECKED_ALL);
                setTempMultipleSelectionData({
                    ...tempMultipleSelectionData,
                    checkedIssueIds: [],
                    assignee: {},
                    validation: ''
                });
                break;
            default:
                break;
        }
    }

    const onCheckRow = (event, currIssue) => {
        const newData = updateTempMultipleSelectionData(TEMP_MULTIPLE_SELECTION_DATA_TYPE.CHECK_ROW, {
            currIssueId: currIssue.id
        });

        if(newData.checkedIssueIds.length === issueList.length) {
            setCheckAllStatus(CHECK_ALL_STATUS.CHECKED_ALL);
        } else {
            setCheckAllStatus(CHECK_ALL_STATUS.NON_CHECKED_ALL);
        }
    }

    const onCancelMultipleSelection = () => {
        setCheckAllStatus(CHECK_ALL_STATUS.DISABLE);
        setTempMultipleSelectionData({
            ...tempMultipleSelectionData,
            checkedIssueIds: [],
            assignee: {},
            validation: ''
        });
    }

    const onApplyMultipleSelection = () => {
        console.log('onApplyMultipleSelection', {tempMultipleSelectionData})
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
            {field: 'ruleInformation.priority,ruleInformation.certainty', label: '', isSort: false},
            // Temporarily disable the multi-select feature
            {
                field: 'choose', 
                // label: <input 
                //     type="checkbox" 
                //     className={classNames('check-input check-all', {
                //         [checkAllStatus]: checkAllStatus
                //     })}
                //     onChange={onCheckAll}
                // />, 
                label: '',
                isSort: false
            },
            {field: 'seq', label: i18n.t('pages.scan-result.issue-table.id'), isSort: false},
            {field: 'ruleInformation.vulnerable', label: i18n.t('pages.scan-result.issue-table.type'), isSort: false},
            {field: 'ruleInformation.name', label: i18n.t('pages.scan-result.issue-table.description'), isSort: false},
            {field: 'scanFile.projectRelativePath', label: i18n.t('pages.scan-result.issue-table.file'), isSort: false},
            {field: 'lineNo', label: i18n.t('pages.scan-result.issue-table.line'), isSort: false},
            {field: 'functionName', label: i18n.t('pages.scan-result.issue-table.function'), isSort: false},
            {field: 'numberOfPath', label: i18n.t('pages.scan-result.issue-table.path'), isSort: false},
            {
                field: 'dsr',
                label: dsrType === enums.DSR_TYPE.FIXED ? i18n.t('pages.dsr.fixed-time') : i18n.t('pages.dsr.detected-time'),
                isShow: !!dsrType
            },
            {field: 'assignTo.displayName', label: i18n.t('pages.scan-result.issue-table.assignee'), isSort: false},
            {field: 'validation', label: i18n.t('pages.scan-result.issue-table.validation'), isSort: false},
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
 
    const getAssignIssueColumn = issue => {
        const menus = userList.map(user => ({
            label: user.displayName,
            value: '',
            onSelect: () => handleAssignIssueToUser(issue.id, user.id, user.displayName, issue.assigneeId)
        }));

        const assigneeDisplayName = tempMultipleSelectionData.checkedIssueIds.includes(issue.id)
                                    ? (tempMultipleSelectionData.assignee.assigneeDisplayName || issue.assigneeDisplayName)
                                    : issue.assigneeDisplayName;

        return <DropDownWithTitle 
            menuGroups={[
                {
                    menus: menus
                }
            ]}
            label={assigneeDisplayName || i18n.t('pages.dsr.issue-table.unassigned')}
            icon={assigneeDisplayName ? <PersonCircle /> : <PersonPlusFill />}
        />;
    }

    const getValidationColumn = issue => {
        const validations = issue.validations || [];
        const validationData = validations.find(x => x.type === enums.ISSUE_VALIDATION_TYPE.DEFAULT) || {};
        const issueValidationAction = validationData.action || enums.ISSUE_VALIDATION_ACTION.UNDECIDED;

        const currValidation = tempMultipleSelectionData.checkedIssueIds.includes(issue.id) 
                                ? (tempMultipleSelectionData.validation || issueValidationAction)
                                : issueValidationAction;

        const ddlIconPath = utils.scanResultHelper.getIconByValidationValue(currValidation);
        const ddlMenus = Object.keys(enums.ISSUE_VALIDATION_ACTION).map(key => {
            const validationValue = enums.ISSUE_VALIDATION_ACTION[key];
            const optionIconPath = utils.scanResultHelper.getIconByValidationValue(validationValue);

            if(!utils.isEnableDevModeOption(enums.DEV_MODE_OPTION.validation)) {
                if(['TP', 'FP'].includes(validationValue)) {
                    return {};
                }
            }

            return {
                label: i18n.t(`pages.scan-result.validation.${validationValue}`),
                value: validationValue,
                icon: <img src={optionIconPath} />,
                onSelect: () => onSelectValidation(issue.id, currValidation, validationValue)
            }
        }).filter(x => !!x.label);

        return <DropDownWithTitle 
            menuGroups={[
                {
                    menus: ddlMenus
                },
                {
                    menus: [{
                        label: '自定义忽略规则',
                        value: '',
                        icon: '',
                        onSelect: () => gotoCustomFilter(issue)
                    }]
                }
            ]}
            label={i18n.t(`pages.scan-result.validation.${currValidation || enums.ISSUE_VALIDATION_ACTION.UNDECIDED}`)}
            icon={<img src={ddlIconPath} />}
        />;
    }

    const getDsrTime = issue => {
        let format = isEnglish ? 'DD/MM/YYYY HH:mm' : 'YYYY/MM/DD HH:mm';
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
                isMisraPage: true,
                scanTaskId,
                currentFilter,
                validationFilterType: issueGroupType === enums.ISSUE_GROUP_TYPE.IGNORE 
                                        ? enums.VALIDATION_FILTER_TYPE.IGNORE 
                                        : enums.VALIDATION_FILTER_TYPE.NON_IGNORE,
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

    }, [scanTaskId, currentFilter, currentPaging.currentPage, currentPaging.pageSize, isReloadIssueGroupList]);

    return (
        <div className="misra-issue-table-wrap">
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
                                    <td>
                                        {getFirstColumn(issue)}
                                    </td>
                                    {/* Temporarily disable the multi-select feature */}
                                    <td></td>
                                    {/* <td className="no_clickable">
                                        {
                                            checkAllStatus !== CHECK_ALL_STATUS.DISABLE &&
                                            <input 
                                                type="checkbox" 
                                                className="check-input" 
                                                checked={tempMultipleSelectionData.checkedIssueIds.includes(issue.id)}
                                                onChange={event => onCheckRow(event, issue)}
                                            />
                                        }
                                    </td> */}
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

                                    <td className="no_clickable">
                                        {getAssignIssueColumn(issue)}
                                    </td>
                                    <td className="no_clickable">
                                        {getValidationColumn(issue)}
                                    </td>
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
            {
                checkAllStatus !== CHECK_ALL_STATUS.DISABLE &&
                <MultipleSelectionTips
                    onApply={onApplyMultipleSelection}
                    onCancel={onCancelMultipleSelection}
                    disabledApply={!tempMultipleSelectionData.validation && utils.isEmptyObject(tempMultipleSelectionData.assignee)}
                    description={i18n.t('pages.scan-result.tooltip.multiple-selection-tip')}
                />
            }
            <ConfirmPrompt
                show={isShowDialog}
                title={i18n.t('common.are-you-sure')}
                cancelBtnText={i18n.t('common.buttons.cancel')}
                confirmBtnText={i18n.t('common.buttons.confirm')}
                contentText={selectedValidation.tooltip}
                onConfirm={updateValidation}
                onCancel={() => setIsShowDialog(false)}
                onHide={() => setIsShowDialog(false)}
            />
        </div>
    );
}
 
export default IssueTable;