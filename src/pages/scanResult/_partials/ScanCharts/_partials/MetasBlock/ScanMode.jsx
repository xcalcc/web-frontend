import React, {useState, useMemo} from 'react';
import i18n from 'i18next';
import {useHistory, useRouteMatch} from "react-router-dom";
import SwitchButton from 'Components/SwitchButton';
import enums from 'Enums';

const ScanMode = props => {
    const history = useHistory();
    const routeMatch = useRouteMatch();

    const isMisraPage = routeMatch.url.indexOf('/misra/') > -1;
    const [isChecked, setIsChecked] = useState(isMisraPage);

    const onSwitchPage = (isChecked) => {
        let targetUrl = '';
        setIsChecked(isChecked);
        if (isMisraPage) {
            targetUrl = history.location.pathname.replace('misra/project', 'project');
        } else {
            targetUrl = history.location.pathname.replace('project', 'misra/project');
        }

        history.push(targetUrl);
    }

    const valueComponent = useMemo(() => {
        if (!props.scanMode) return;

        if (props.scanMode === enums.SCAN_MODE.SINGLE_XSCA) {
            const beforeLabel = i18n.t('pages.scan-result.single');
            const afterLabel = i18n.t('pages.scan-result.misra');

            return <SwitchButton
                checked={isChecked}
                beforeLabel={beforeLabel}
                afterLabel={afterLabel}
                onChange={onSwitchPage}
            />
        } else {
            return i18n.t(`common.scan-mode.${props.scanMode}`);
        }
    }, [props.scanMode]);

    return <>
        <span className="title">{i18n.t('common.scan-mode.title')}</span>
        <span>
            {valueComponent}
        </span>
    </>;
}

export default ScanMode;