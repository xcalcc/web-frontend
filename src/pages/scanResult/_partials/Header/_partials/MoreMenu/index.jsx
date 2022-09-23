import React, {useState} from 'react';
import {useDispatch} from "react-redux";
import {Image} from 'react-bootstrap';
import {useHistory} from 'react-router-dom';
import * as actions from 'Actions';
import i18n from 'i18next';
import Loader from 'Components/Loader';
import ConfirmPrompt from 'Containers/ConfirmPrompt';
import Dropdown from "Components/Dropdown";

import TrashIcon from 'Icons/trash.svg';
import SettingIcon from 'Icons/settings.svg';
import './style.scss';

const MoreMenu = props => {
    const {
        projectUuid,
    } = props;

    const dispatch = useDispatch();
    const history = useHistory();

    const [isLoading, setIsLoading] = useState(false);
    const [isShowDeleteProjectAlert, setIsShowDeleteProjectAlert] = useState(false);

    const ddlOptions = [
        {
            label: i18n.t('pages.scan-result.right-nav.project-setting'),
            value: 1,
            icon: <Image src={SettingIcon}/>
        },
        {
            label: i18n.t('pages.scan-result.right-nav.delete'),
            value: 2,
            icon: <Image src={TrashIcon}/>
        }
    ];

    const handleSelected = data => {
        switch(data.value) {
            case 1:
                history.push(`/project-setting/${projectUuid}`);
                break;
            case 2:
                setIsShowDeleteProjectAlert(true);
                break;
            default:
                break;
        }
    }

    const handleDeleteProject = async () => {
        setIsLoading(true);
        const result = await dispatch(actions.deleteProject(projectUuid));
        setIsLoading(false);
        setIsShowDeleteProjectAlert(false);
        if(result.status === 204) {
            dispatch(actions.pushAlert({
                type: 'message',
                title: i18n.t('common.notifications.success'),
                content: i18n.t('common.notifications.delete-success'),
                callbackFn: () => {
                    history.replace('/dashboard');
                }
            }));
        } else {
            dispatch(actions.pushAlert({
                type: 'error',
                title: i18n.t('common.notifications.failure'),
                content: i18n.t('common.notifications.delete-failure')
            }));
        }
    }

    return <div className="scan-result-header__more-menu">
        {isLoading && <Loader />}
        <Dropdown
            label='···'
            options={ddlOptions}
            onSelect={data => handleSelected(data)}
        />
        <ConfirmPrompt
            show={isShowDeleteProjectAlert}
            title={i18n.t('common.are-you-sure')}
            cancelBtnText={i18n.t('common.buttons.cancel')}
            confirmBtnText={i18n.t('common.delete-it')}
            contentText={i18n.t('common.delete-tip')}
            onConfirm={handleDeleteProject}
            onCancel={() => setIsShowDeleteProjectAlert(false)}
            onHide={() => setIsShowDeleteProjectAlert(false)}
        />
    </div>;
}

export default MoreMenu;