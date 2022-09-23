import React, {useState} from 'react';
import i18n from 'i18next';
import copy from 'copy-to-clipboard';
import TooltipWrapper from 'Components/TooltipWrapper';
import CopyIcon from 'Icons/copy.svg';

import './style.scss';

const CopyIconComponent = ({copyText, tipMessage}) => {
    const defaultTipMsg = tipMessage || i18n.t('common.copy');
    const [tipMsg, setTipMsg] = useState(defaultTipMsg);
    const onCopy = (event, text) => {
        if (event && event.stopPropagation) {
            event.stopPropagation();
        }
        copy(text);
        setTipMsg(i18n.t('common.copied'));
    }

    return <span 
        className="copy-icon" 
        onClick={(e) => onCopy(e, copyText)}
        onMouseOut={() => setTipMsg(defaultTipMsg)}
    >
        <TooltipWrapper
            tooltipText={tipMsg}
            children={<img src={CopyIcon}/>}
            options={
                {
                    placement: 'top',
                }
            }
        />
    </span>;
}

export default CopyIconComponent;