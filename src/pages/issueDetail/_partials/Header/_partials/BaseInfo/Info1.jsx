import React from 'react';
import i18n from 'i18next';
import enums from 'Enums';
import './style.scss';

const BaseInfo = ({issueGroup, projectData, ruleInfo}) => {
    let scanMode = projectData.scanMode || enums.SCAN_MODE.SINGLE;
    if (projectData.scanMode === enums.SCAN_MODE.SINGLE_XSCA) {
        scanMode = enums.MISRA_RULE_SETS.includes(issueGroup.ruleSet) ? enums.SCAN_MODE.XSCA : enums.SCAN_MODE.SINGLE;
    }

    let issueStatus;
    switch(issueGroup.dsr) {
        case enums.DSR_TYPE.NEW:
            issueStatus = i18n.t('issueDetail.new-defects');
            break;
        case enums.DSR_TYPE.FIXED:
            issueStatus = i18n.t('issueDetail.fixed-defects');
            break;
        case enums.DSR_TYPE.OUTSTANDING:
            issueStatus = i18n.t('issueDetail.outstanding-defects');
            break;
        default:
            break;
    }

    if(enums.DSR_TYPE.OUTSTANDING_ALL.includes(issueGroup.dsr)) {
        issueStatus = i18n.t('issueDetail.outstanding-defects');
    }

    return <div className="issue-detail__header__baseinfo">
        <p>
            <span className="title">{i18n.t('issueDetail.id')}</span>
            <span className="value issue-id">{issueGroup.id}</span>
        </p>
        <p>
            <span className="title">{i18n.t('issueDetail.type')}</span>
            <span className="value">{ruleInfo.code || issueGroup.ruleCode}</span>
        </p>
        <p>
            <span className="title">{i18n.t('common.scan-mode.title')}</span>
            <span className="value">{i18n.t(`common.scan-mode.${scanMode}`)}</span>
        </p>
        <p>
            <span className="title">{i18n.t('issueDetail.status')}</span>
            <span className="value">{issueStatus}</span>
        </p>
    </div>;
}

export default BaseInfo;