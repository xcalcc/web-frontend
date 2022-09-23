import React from 'react';
import i18n from 'i18next';
import {InfoCircle} from 'react-bootstrap-icons';
import * as utils from 'Utils'
import SwitchButton from 'Components/SwitchButton';
import TooltipWrapper from 'Components/TooltipWrapper';

const PossibleDefects = props => {
    const {
        currentFilter,
        onPossibleDefectsToggle,
        certaintyCount
    } = props;

    return <>
        <SwitchButton
            checked={currentFilter.includePossibleDefect}
            onChange={onPossibleDefectsToggle}
        />
            <span className="label">{i18n.t('pages.scan-result.side-bar.include-possible-defects')}</span>
            <span className="number">{utils.formatNumber(certaintyCount)}</span>
            <div className="tooltip-icon">
            <TooltipWrapper
                tooltipText={i18n.t('pages.scan-result.side-bar.possible-defects-tooltip')}
                children={<InfoCircle />}
                options={
                    {
                        placement: 'right',
                    }
                }
            />
        </div>
    </>;
}

export default PossibleDefects;