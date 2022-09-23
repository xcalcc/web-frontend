import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useLocation, useHistory, useRouteMatch} from 'react-router-dom';
import classNames from 'classnames';
import i18n from 'i18next';
import * as actions from 'Actions';
import enums from 'Enums';
import * as utils from 'Utils';

import './style.scss';

const PreviousNext = ({scanTaskId}) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const routeMatch = useRouteMatch();

    const [isFirstPage, setIsFirstPage] = useState(false);
    const [isLastPage, setIsLastPage] = useState(false);
    const [totalPages, setTotalPages] = useState();
    const issueDetailAction = actions.getPageActions('issueDetail');
    const issueGroup = useSelector(state => state.issues.issueGroup);
    const currentFilter = useSelector(state => state.page.scanResult.filter);
    let singleIssueGroupPageNumber = useSelector(state => state.page.issueDetail.singleIssueGroupPageNumber);

    const urlQuery = utils.queryString();
    const projectKey = routeMatch.params.projectKey;

    const handleNavigatePage = async (goNext) => {
        if (utils.isEmpty(singleIssueGroupPageNumber)) {
            return;
        }

        if (goNext) {
            if (isLastPage) return;
            singleIssueGroupPageNumber++;
        } else {
            if (isFirstPage) return;
            singleIssueGroupPageNumber--;
        }

        const payload = dispatch(actions.getPayloadOfSearchIssue({
            isDsrPage: !!urlQuery.dsr,
            isMisraPage: enums.MISRA_RULE_SETS.includes(issueGroup.ruleSet),
            scanTaskId, 
            currentFilter, 
            pageNumber: singleIssueGroupPageNumber, 
            pageSize: 1
        }));

        if(urlQuery.dsr) {
            if(enums.DSR_TYPE.OUTSTANDING_ALL.includes(urlQuery.dsr)) {
                payload.dsrType = [...enums.DSR_TYPE.OUTSTANDING_ALL];
            } else {
                payload.dsrType = [urlQuery.dsr];
            }
        } else {
            payload.dsrType = [enums.DSR_TYPE.NEW, ...enums.DSR_TYPE.OUTSTANDING_ALL];
        }

        const response = await dispatch(actions.searchIssueGroup(payload));

        if(response.error) {
            dispatch(actions.pushAlert({
                type: 'error',
                title: i18n.t('common.notifications.failure'),
                content: utils.getApiMessage(response.error)
            }));
            return;
        }

        if(response.content && response.content[0] && response.content[0].id) {
            setTotalPages(response.totalPages);

            history.replace(`/project/${projectKey}/scan/${scanTaskId}/issue/${response.content[0].id}${location.search}`);
            dispatch(issueDetailAction.setSingleIssueGroupPageNumber({
                scanTaskId,
                pageNumber: singleIssueGroupPageNumber
            }));
        }
    };

    useEffect(() => {
        if(utils.isEmpty(singleIssueGroupPageNumber)) {
            setIsFirstPage(true);
            setIsLastPage(true);
            return;
        }

        setIsFirstPage(false);
        setIsLastPage(false);

        if (singleIssueGroupPageNumber === 1) {
            setIsFirstPage(true);
        }
        else if (singleIssueGroupPageNumber === totalPages) {
            setIsLastPage(true);
        }
    }, [singleIssueGroupPageNumber]);

    return <div className="previous-next">
        <a 
            className={classNames('previous-link', {
                disabled: isFirstPage
            })}
            onClick={() => handleNavigatePage(false)}
        >
            {i18n.t('issueDetail.previous')}
        </a>
        <div className="divider"></div>
        <a 
            className={classNames('next-link', {
                disabled: isLastPage
            })}
            onClick={() => handleNavigatePage(true)}
        >
            {i18n.t('issueDetail.next')}
        </a>
    </div>
}

export default PreviousNext;