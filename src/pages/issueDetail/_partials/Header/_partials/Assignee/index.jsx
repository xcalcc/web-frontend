import React, {useState, useEffect, useMemo} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import i18n from 'i18next';
import moment from 'moment';
import * as actions from 'Actions';
import Loader from 'Components/Loader';
import Dropdown from "Components/Dropdown";
import enums from 'Enums';
import * as utils from 'Utils';
import PersonIcon from 'Icons/person.svg';
import PersonFillIcon from 'Icons/person_fill.svg';

import './style.scss';

const Assignee = ({issueGroup}) => {
    const dispatch = useDispatch();
    const userList = useSelector(state => state.user.userList);
    const [userOptions, setUserOptions] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState({});
    const [selectedValidation, setSelectedValidation] = useState('');

    const dateFormat = utils.isChinese() ? 'YYYY/MM/DD' : 'DD/MM/YYYY';
    const scanEndMomentEntity = moment(issueGroup.occurTime);
    const date = (scanEndMomentEntity.isValid() && scanEndMomentEntity.format(dateFormat)) || '';
    const time = (scanEndMomentEntity.isValid() && scanEndMomentEntity.format('HH:mm:ss')) || '';

    const issueValidationAction = enums.ISSUE_VALIDATION_ACTION;
    if(!utils.isEnableDevModeOption(enums.DEV_MODE_OPTION.validation)) {
        delete issueValidationAction.TRUE_POSITIVE;
        delete issueValidationAction.FALSE_POSITIVE
    }

    const validationOptions = Object.keys(issueValidationAction).map(key => {
        const validationValue = enums.ISSUE_VALIDATION_ACTION[key];
        const optionIconPath = utils.scanResultHelper.getIconByValidationValue(validationValue);

        return {
            label: i18n.t(`pages.scan-result.validation.${validationValue}`),
            value: validationValue,
            icon: <img src={optionIconPath} />
        }
    });

    const handleUserSelected = async user => {
        setIsLoading(true);
        const assignResult = await dispatch(actions.assignIssueToUser(issueGroup.id, user.id));
        setIsLoading(false);

        if(assignResult.error) {
            dispatch(actions.pushAlert({
                type: 'error',
                title: i18n.t('common.notifications.failure'),
                content: utils.getApiMessage(assignResult.error)
            }));
        } else {
            setSelectedUser(user);
        }
    };

    const handleValidationSelected = async selected => {
        if(selected.value === selectedValidation) return;

        const defaultValidation = issueGroup.validations && 
                issueGroup.validations.find(x => x.type === enums.ISSUE_VALIDATION_TYPE.DEFAULT);

        let responseData;
        if(!defaultValidation) {
            responseData = await dispatch(actions.addIssueValidation({
                projectId: issueGroup.projectId,
                scanTaskId: issueGroup.occurScanTaskId,
                ruleCode: issueGroup.ruleCode,
                filePath: issueGroup.sinkRelativePath || issueGroup.srcRelativePath,
                functionName: issueGroup.functionName,
                variableName: issueGroup.variableName,
                type: enums.ISSUE_VALIDATION_TYPE.DEFAULT,
                action: selected.value,
                scope: enums.ISSUE_VALIDATION_SCOPE.GLOBAL
            }));
        } else if(selected.value === enums.ISSUE_VALIDATION_ACTION.UNDECIDED) {
            responseData = await dispatch(actions.deleteIssueValidation(defaultValidation.id));
        } else {
            responseData = await dispatch(actions.updateIssueValidation({
                id: defaultValidation.id,
                action: selected.value
            }));
        }        

        if(responseData.error) {
            dispatch(actions.pushAlert({
                type: 'error',
                title: i18n.t('common.notifications.failure'),
                content: utils.getApiMessage(responseData.error)
            }));
            return;
        }

        setSelectedValidation(selected.value);
    }

    const getValidationAction = () => {
        const validations = issueGroup.validations || [];
        const validationData = validations.find(x => x.type === enums.ISSUE_VALIDATION_TYPE.DEFAULT) || {};
        const issueValidationAction = validationData.action || enums.ISSUE_VALIDATION_ACTION.UNDECIDED;
        return issueValidationAction;
    }

    useMemo(() => {
        if(!utils.isEmptyObject(issueGroup)) {
            setSelectedValidation(getValidationAction());
            setSelectedUser({
                id: issueGroup.assigneeId,
                displayName: issueGroup.assigneeDisplayName || i18n.t('issueDetail.unassigned'),
            });
        }
    }, [issueGroup]);

    useMemo(() => {
        if(!userList) return;

        let options = userList.sort((a, b) => {
            return a.displayName.localeCompare(b.displayName);
        });

        options = options.map(user => {
            return {
                ...user,
                value: user.id,
                label: user.displayName
            }
        });
        setUserOptions(options);
    }, [userList]);

    useEffect(() => {
        dispatch(actions.getUserList());
    }, []);

    return <div className="issue-detail__header__assignee">
        {
            isLoading && <Loader/>
        }
        <div className="time">
            <span className="title">{i18n.t('issueDetail.first-detected')}</span>
            <span className="value">
                {date} <br/> {time}
            </span>
        </div>
        {
            utils.getAppFrom() !== enums.APP_FROM.ANT &&
            <div className="ddl-panel user">
                <span className="title">{i18n.t('issueDetail.assigned')}</span>
                <div className="value">
                    <Dropdown
                        alignment='right'
                        label={selectedUser.displayName}
                        selectedValue={selectedUser.id}
                        options={userOptions}
                        icon={<img src={selectedUser.id ? PersonFillIcon : PersonIcon} />}
                        optionIcon={<img src={PersonFillIcon}/>}
                        onSelect={(data) => handleUserSelected(data)}
                    />
                </div>
            </div>
        }
        <div className="ddl-panel validation">
            <span className="title">{i18n.t('issueDetail.validation')}</span>
            <div className="value">
                <Dropdown
                    label={selectedValidation && i18n.t(`pages.scan-result.validation.${selectedValidation}`)}
                    selectedValue={selectedValidation}
                    options={validationOptions}
                    icon={<img src={utils.scanResultHelper.getIconByValidationValue(selectedValidation)} />}
                    onSelect={(data) => handleValidationSelected(data)}
                />
            </div>
        </div>
    </div>;
}

export default Assignee;