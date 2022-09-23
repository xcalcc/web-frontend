import React from 'react';
import i18n from 'i18next';
import {Spinner} from 'react-bootstrap';
import TooltipWrapper from 'Components/TooltipWrapper';
import './style.scss';

const ScanningIcon = props => {
    return <div className="project-scanning-icon">
        <TooltipWrapper
            tooltipText={i18n.t(`dashboard.scanning`)}
            options={
                {
                    placement: 'top',
                }
            }
        >
            <Spinner animation="border" variant="danger" />
        </TooltipWrapper>
    </div>
}

export default ScanningIcon;