import React from 'react';
import i18n from 'i18next';
import DataList from './DataList';

const RuleSetBlock = props => {
    const {
        currentFilter,
        onSelectRuleSetFilter,
        ruleSetsWithIssues,
    } = props;

    return <DataList
        noScrollY
        title={i18n.t('pages.scan-result.rule-standard')}
        items={ruleSetsWithIssues}
        onSelect={onSelectRuleSetFilter}
        selected={[currentFilter.ruleSetId || currentFilter.standard || currentFilter.customRuleSetId]}
    />;
}

export default RuleSetBlock;