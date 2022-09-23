import React, {useState, useMemo} from 'react';
import i18n from 'i18next';
import SwitchButton from 'Components/SwitchButton';
import enums from 'Enums';

const ScanMode = props => {
    const {
        scanMode,
        onSwitchScanMode
    } = props;

    const [isChecked, setIsChecked] = useState(false);

    const onSwitch = (isSelectedMisra, event) => {
        setIsChecked(isSelectedMisra);
        onSwitchScanMode && onSwitchScanMode(isSelectedMisra, event);
    }

    const component = useMemo(() => {
        if(scanMode === enums.SCAN_MODE.SINGLE_XSCA) {
            const beforeLabel = i18n.t('pages.scan-result.single');
            const afterLabel = i18n.t('pages.scan-result.misra');

            return <SwitchButton
                checked={isChecked}
                beforeLabel={beforeLabel}
                afterLabel={afterLabel}
                onChange={onSwitch}
            />
        } else {
            return i18n.t(`common.scan-mode.${scanMode || enums.SCAN_MODE.SINGLE}`);
        }
    }, [scanMode, isChecked]);

    return <span className="scan-mode-switch" onClick={e => e.stopPropagation()}>
        {component}
    </span>;
}

export default ScanMode;