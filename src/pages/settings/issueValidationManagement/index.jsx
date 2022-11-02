import React, {useState, useEffect} from "react";
import i18n from 'i18next';
import {useDispatch} from 'react-redux';
import {Container, Row, Col, Image} from 'react-bootstrap';
import * as actions from 'Actions';
import * as utils from 'Utils';
import enums from 'Enums';
import Loader from 'Components/Loader';
import ConfirmPrompt from 'Containers/ConfirmPrompt';
import ListContent from './_partials/list';
import SettingIcon from 'Images/icon/administration-icon.svg';
import './style.scss';

const IssueFilter = () => {
    const dispatch = useDispatch();

    const [totalPages, setTotalPages] = useState(0);
    const [tablePaging, setTablePaging] = useState({
        currentPage: 1,
        pageSize: 15
    });
    const [filterList, setFilterList] = useState();
    const [isRefreshList, setIsRefreshList] = useState();
    const [currentDeleteId, setCurrentDeleteId] = useState();
    const [isShowDeleteAlert, setIsShowDeleteAlert] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSetTablePaging = paging => {
        setTablePaging(paging);
        setIsRefreshList(Math.random());
    }

    const handleDelete = id => {
        setCurrentDeleteId(id);
        setIsShowDeleteAlert(true);
    }

    const deleteFilter = async () => {
        setIsShowDeleteAlert(false);
        setIsLoading(true);
        const result = await dispatch(actions.deleteIssueValidation(currentDeleteId));

        if(result.error) {
            alertError(result.error);
            setIsLoading(false);
        } else {
            setIsRefreshList(Math.random());
        }
    }

    const alertError = error => {
        dispatch(actions.pushAlert({
            type: 'error',
            title: i18n.t('common.notifications.failure'),
            content: utils.getApiMessage(error)
        }));
    }

    useEffect(() => {
        (async () => {
            setIsLoading(true);

            await dispatch(actions.fetchRuleList());

            const response = await dispatch(actions.searchIssueValidationList({
                type: enums.ISSUE_VALIDATION_TYPE.DEFAULT,
                page: tablePaging.currentPage - 1,
                size: tablePaging.pageSize
            }));

            if(response.error) {
                alertError(response.error);
                setIsLoading(false);
                return;
            }

            setTotalPages(response.totalPages);
            setFilterList(response.content || []);
            setIsLoading(false);
        })();
    }, [isRefreshList]);

    return <Container fluid className="settings data-management issue-validation">
        {isLoading && <Loader/>}
        <Row className="settings-title">
            <Col className="text-center">
                <Image className="icon" src={SettingIcon} />
                <p>{i18n.t('pages.issue-filters.validation-title')}</p>
            </Col>
        </Row>
        <Row className="settings-wrap">
            <ListContent
                totalPages={totalPages}
                tablePaging={tablePaging}
                filterList={filterList}
                onDelete={handleDelete}
                onSetTablePaging={handleSetTablePaging}
            />
        </Row>
        <ConfirmPrompt
            show={isShowDeleteAlert}
            title={i18n.t('common.are-you-sure')}
            cancelBtnText={i18n.t('common.buttons.cancel')}
            confirmBtnText={i18n.t('common.delete-it')}
            contentText={i18n.t('common.delete-tip')}
            onConfirm={deleteFilter}
            onCancel={() => setIsShowDeleteAlert(false)}
            onHide={() => setIsShowDeleteAlert(false)}
        />
    </Container>
}

export default IssueFilter;
