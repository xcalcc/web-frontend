import React, {useMemo} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import classNames from 'classnames';
import enums from 'Enums';
import * as utils from 'Utils';
import * as actions from 'Actions';
import BaseInfo1 from './_partials/BaseInfo/Info1';
import BaseInfo2 from './_partials/BaseInfo/Info2';
import Assignee from './_partials/Assignee';
import TotalPaths from './_partials/TotalPaths';
import Meters from './_partials/Meters';

import './style.scss';

const Header = props => {
    const dispatch = useDispatch();

    const projectData = useSelector(state => state.project.projectData);
    const issueGroup = useSelector(state => state.issues.issueGroup);

    const ruleInfo = useMemo(() => dispatch(actions.getRuleInfoByCsvCode(issueGroup.ruleCode)), [issueGroup]);

    const criticalityStyle = classNames({
        high: issueGroup.criticality === enums.ISSUE_CRITICALITY.high,
        medium: issueGroup.criticality === enums.ISSUE_CRITICALITY.medium,
        low: issueGroup.criticality === enums.ISSUE_CRITICALITY.low,
        certainty: issueGroup.certainty === enums.ISSUE_CERTAINTY.D
    });

    return <div className="issue-detail__header">
        <div className={"header-column line-column " + criticalityStyle}>
            <BaseInfo1 
                issueGroup={issueGroup} 
                projectData={projectData} 
                ruleInfo={ruleInfo}
            />
        </div>
        <div className="divider"></div>
        <div className="header-column file-info-column">
            <BaseInfo2 
                issueGroup={issueGroup} 
                projectData={projectData} 
            />
        </div>
        <div className="divider"></div>
        <div className="header-column assignee-column">
            <Assignee issueGroup={issueGroup} />
        </div>
        <div className="divider"></div>
        <div className="header-column">
            <TotalPaths 
                total={utils.formatNumber(issueGroup.issueCount)} 
            />
        </div>
        {
            issueGroup.ruleSet && !enums.MISRA_RULE_SETS.includes(issueGroup.ruleSet) &&
            <>
                <div className="divider"></div>
                <div className="header-column">
                    <Meters issueGroup={issueGroup} />
                </div>
            </>
        }
    </div>;
}

export default Header;