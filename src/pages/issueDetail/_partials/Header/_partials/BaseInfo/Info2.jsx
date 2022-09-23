import React from 'react';
import i18n from 'i18next';
import enums from 'Enums';
import * as utils from 'Utils';
import TooltipWrapper from 'Components/TooltipWrapper';
import './style.scss';

const BaseInfo2 = ({issueGroup, projectData}) => {

    const tooltipWrapper = text => {
        return <TooltipWrapper
            className="issue-detail__header__tooltip"
            tooltipText={utils.html2Escape(text)}
            options={
                {
                    placement: 'top-start',
                }
            }
        >
            <span>{text}</span>
        </TooltipWrapper>;
    }

    const TEXT_MAX_LIMIT = 11;
    const _relativePath = issueGroup.sinkRelativePath || issueGroup.srcRelativePath || '';
    const _functionName = issueGroup.functionName || '';
    const _variableName = issueGroup.variableName || '';

    const relativePath = _relativePath.length > TEXT_MAX_LIMIT ? tooltipWrapper(_relativePath) : _relativePath;
    const functionName = _functionName.length > TEXT_MAX_LIMIT ? tooltipWrapper(_functionName) : _functionName;
    const variableName = _variableName.length > TEXT_MAX_LIMIT ? tooltipWrapper(_variableName) : _variableName;

    return <div className="issue-detail__header__baseinfo">
        <p>
            <span className="title">{i18n.t('issueDetail.file')}</span>
            <span className="value">{relativePath}</span>
        </p>
        <p>
            <span className="title">{i18n.t('issueDetail.line')}</span>
            <span className="value">{issueGroup.sinkLineNo || issueGroup.srcLineNo}</span>
        </p>
        <p>
            <span className="title">{i18n.t('issueDetail.function')}</span>
            <span className="value">{functionName}</span>
        </p>
        {
            issueGroup.ruleSet && !enums.MISRA_RULE_SETS.includes(issueGroup.ruleSet) &&
            <p>
                <span className="title">{i18n.t('issueDetail.variable')}</span>
                <span className="value">{variableName}</span>
            </p>
        }
    </div>;
}

export default BaseInfo2;