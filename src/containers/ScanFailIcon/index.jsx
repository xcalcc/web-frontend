import React from 'react';
import i18n from 'i18next';
import {Image} from 'react-bootstrap';
import moment from 'moment';
import * as utils from 'Utils';
import TooltipWrapper from 'Components/TooltipWrapper';
import WarningIcon from 'Icons/warning.svg';

import './style.scss';

const ScanFailIcon = ({scanEndAt, hasScanSuccessfulRecord, tooltipPlacement}) => {
    const dateFormat = utils.isChinese() ? 'YYYY/MM/DD' : 'DD/MM/YYYY';
    const tooltipText = hasScanSuccessfulRecord 
                        ? i18n.t('pages.scan-result.tooltip.scan-fail', {
                                date: moment(scanEndAt).format(dateFormat),
                                time: moment(scanEndAt).format('HH:mm:ss')
                            })
                        : i18n.t('dashboard.scan-failed-tip');
    return <TooltipWrapper
            tooltipText={tooltipText}
            options={
                {
                    placement: tooltipPlacement,
                }
            }
        >
            <Image className="fail-icon" src={WarningIcon} />
        </TooltipWrapper>;
}

export default ScanFailIcon;