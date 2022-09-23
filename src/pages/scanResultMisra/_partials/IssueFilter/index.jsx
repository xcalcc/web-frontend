import React, {useState, useMemo} from 'react';
import {useSelector} from 'react-redux';
import {Dropdown} from 'react-bootstrap';
import i18n from 'i18next';
import * as utils from 'Utils'
import enums from 'Enums';
import IssueSearchBox from '../../../scanResult/_partials/IssueFilter/_partials/IssueSearchBox';
import FilterPopup from './_partials/FilterPopup';

import DropdownIcon from 'Icons/dropdown.svg';
import DropdownRedIcon from 'Icons/dropdown_red.svg';
import './style.scss';

const IssueFilter = ({isDsrPage, scanTaskId}) => {
    const [showPopup, setShowPopup] = useState(false);
    const [isToggleHidePopup, setIsToggleHidePopup] = useState(false);

    const currentFilter = useSelector(state => state.page.scanResult.filter);
    const generalTotalIssues = useSelector(state => state.page.scanResult[enums.ISSUE_GROUP_TYPE.GENERAL].paging.totalIssues);
    const dsrNewTotalIssues = useSelector(state => state.page.scanResult[enums.ISSUE_GROUP_TYPE.DSR_NEW].paging.totalIssues);
    const dsrFixedTotalIssues = useSelector(state => state.page.scanResult[enums.ISSUE_GROUP_TYPE.DSR_FIXED].paging.totalIssues);
    const dsrOutstandingTotalIssues = useSelector(state => state.page.scanResult[enums.ISSUE_GROUP_TYPE.DSR_OUTSTANDING].paging.totalIssues);

    let totalIssues = 0;
    if(isDsrPage) {
        totalIssues = dsrNewTotalIssues + dsrFixedTotalIssues + dsrOutstandingTotalIssues;
    } else {
        totalIssues = generalTotalIssues;
    }

    const filterConditionsCount = useMemo(() => {
        let count = 0;
        if(currentFilter.ruleSetId || currentFilter.standard) {
            count = 1;
        }
        const ruleCodes = currentFilter.ruleCodes && currentFilter.ruleCodes.filter(x => x.ruleCode);
        count += ruleCodes.length;
        return count;
    }, [currentFilter]);

    const hidePopup = () => {
        setShowPopup(false);
    }

    const togglePopup = () => {
        setShowPopup(!showPopup);
        setIsToggleHidePopup(showPopup);
    }

    return <div className="issue-filter">
        <div className="total">
            <span className="number">{utils.formatNumber(totalIssues)}</span>
            {i18n.t('pages.scan-result.results')}
        </div>
        <div className="divide"></div>
        <Dropdown 
            show={showPopup} 
            className="filter-dropdown"
            onToggle={togglePopup}
        >
            <Dropdown.Toggle variant="custom">
                {i18n.t('pages.scan-result.side-bar.filter')}
                {filterConditionsCount > 0 && <span className="num">(<label>{filterConditionsCount}</label>)</span>}
                <span className="down-arrow-icon">
                    {showPopup ? <img src={DropdownRedIcon}/> : <img src={DropdownIcon}/>}
                </span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <FilterPopup 
                    isToggleHidePopup={isToggleHidePopup}
                    isDsrPage={isDsrPage}
                    scanTaskId={scanTaskId}
                    onHidePopup={hidePopup} 
                />
            </Dropdown.Menu>
        </Dropdown>
        <IssueSearchBox isMisraPage={true} isDsrPage={isDsrPage} scanTaskId={scanTaskId} />
    </div>;
}

export default IssueFilter;