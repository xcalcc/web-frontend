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

    const dateFormat = utils.isChinese() ? 'YYYY/MM/DD' : 'DD/MM/YYYY';
    const scanEndMomentEntity = moment(issueGroup.occurTime);
    const date = (scanEndMomentEntity.isValid() && scanEndMomentEntity.format(dateFormat)) || '';
    const time = (scanEndMomentEntity.isValid() && scanEndMomentEntity.format('HH:mm:ss')) || '';

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

    useMemo(() => {
        if(!utils.isEmptyObject(issueGroup)) {
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
            <div className="user">
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
    </div>;
}

export default Assignee;