import React from 'react';
import i18n from 'i18next';
import XButton from 'Components/Button';
import IconWarning from 'Icons/warning.svg';

const MultipleSelectionTips = props => {
    const {
        disabledApply,
        description,
        onApply,
        onCancel
    } = props;

    return <div className="multiple-selection-tips">
        <p className="desc">
            <img src={IconWarning} />
            {description}
        </p>
        <div className="buttons">
            <XButton
                grey
                label={i18n.t("common.buttons.cancel")}
                onClick={onCancel}
            />
            <XButton
                red
                label={i18n.t("common.buttons.confirm")}
                disabled={disabledApply}
                onClick={onApply}
            />
        </div>
    </div>
}

export default MultipleSelectionTips;