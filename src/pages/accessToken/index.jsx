import React, {useState, useEffect} from "react";
import i18n from 'i18next';
import moment from 'moment';
import {useDispatch} from 'react-redux';
import {Container, Row, Col, Image} from 'react-bootstrap';
import * as actions from 'Actions';
import * as utils from 'Utils';
import Loader from 'Components/Loader';
import Section from 'Components/Section';
import {XInput} from 'Components/Form';
import XButton from 'Components/Button';
import ConfirmPrompt from 'Containers/ConfirmPrompt';
import SettingIcon from 'Images/icon/administration-icon.svg';
import './style.scss';

const AccessToken = () => {
    const dispatch = useDispatch();

    const dateFormat = utils.isChinese() ? 'YYYY/MM/DD' : 'DD/MM/YYYY';
    const [tokenName, setTokenName] = useState();
    const [tokenExpireDays, setTokenExpireDays] = useState();
    const [tokenList, setTokenList] = useState();
    const [isTokenListChnage, setIsTokenListChange] = useState();
    const [currentTokenId, setCurrentTokenId] = useState();
    const [isShowDeleteAlert, setIsShowDeleteAlert] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleNameChange = (e) => {
        const value = e.target.value;
        setTokenName(utils.trim(value));
    }

    const handleDaysChange = (e) => {
        let value = e.target.value;
        value = value.replace(/^0|[^0-9]/g, '');
        setTokenExpireDays(Number(value) || '');
    }

    const handleSave = async () => {
        if(!tokenName || !tokenExpireDays) return;

        setIsLoading(true);

        const result = await dispatch(actions.generateAccessToken(tokenName, tokenExpireDays));
        if(result.error) {
            alertError(result.error);
            setIsLoading(false);
        } else {
            setTokenName('');
            setTokenExpireDays('');
            setIsTokenListChange(Math.random());
        }
    }

    const handleDelete = id => {
        setCurrentTokenId(id);
        setIsShowDeleteAlert(true);
    }

    const deleteToken = async () => {
        setIsShowDeleteAlert(false);
        setIsLoading(true);
        const result = await dispatch(actions.deleteAccessToken(currentTokenId));
        if(result.error) {
            alertError(result.error);
            setIsLoading(false);
        } else {
            setIsTokenListChange(Math.random());
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

            const accessTokenList = await dispatch(actions.fetchAccessTokenList());

            if(accessTokenList.error) {
                alertError(accessTokenList.error);
                setIsLoading(false);
                return;
            }

            setTokenList(accessTokenList);
            setIsLoading(false);
        })();
    }, [isTokenListChnage]);

    return <Container fluid className="settings data-management access-token">
        {isLoading && <Loader/>}
        <Row className="settings-title">
            <Col className="text-center">
                <Image className="icon" src={SettingIcon} />
                <p>{i18n.t('pages.settings.access-token.title')}</p>
            </Col>
        </Row>
        <Row className="settings-wrap">
            <Section title={i18n.t('pages.settings.access-token.new-token-title')}>
                <Container fluid className="settings-content noPadding">
                    <Row noGutters>
                        <Col>
                            <div className="settings-content-title">
                                {i18n.t('pages.settings.access-token.new-token-description')}
                            </div>
                        </Col>
                    </Row>
                    <Row className="input-wrap">
                        <Col md={4}>
                            <p>{i18n.t('pages.settings.access-token.token-name')}</p>
                            <XInput 
                                type="text"
                                maxLength={20}
                                value={tokenName}
                                onChange={handleNameChange}
                            />
                        </Col>
                        <Col md={4}>
                            <p>{i18n.t('pages.settings.access-token.token-expiration')}</p>
                            <XInput 
                                type="text"
                                maxLength={5}
                                value={tokenExpireDays}
                                onChange={handleDaysChange}
                            />
                        </Col>
                        <Col md={1} className="noPadding">
                            <span className="input-suffix">{i18n.t('pages.settings.access-token.token-expiration-unit')}</span>
                        </Col>
                        <Col md={3}>
                            <XButton
                                red
                                label={i18n.t("pages.settings.access-token.button-save")}
                                onClick={handleSave}
                            />
                        </Col>
                    </Row>
                </Container>
            </Section>

            <Section title={i18n.t('pages.settings.access-token.token-list-title')}>
                <Container fluid className="settings-content noPadding">
                    <Row noGutters>
                        <Col>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>{i18n.t('pages.settings.access-token.token-name')}</th>
                                        <th>{i18n.t('pages.settings.access-token.token')}</th>
                                        <th>{i18n.t('pages.settings.access-token.token-created')}</th>
                                        <th>{i18n.t('pages.settings.access-token.token-expiration-date')}</th>
                                        <th>{i18n.t('pages.settings.access-token.action')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        tokenList && tokenList.map(token => (
                                            <tr key={token.id}>
                                                <td>{token.tokenName}</td>
                                                <td>{token.token}</td>
                                                <td>{moment(token.createdOn).format(dateFormat)}</td>
                                                <td>{moment(token.expireDate).format(dateFormat)}</td>
                                                <td>
                                                    <span
                                                        className="link"
                                                        onClick={() => handleDelete(token.id)}
                                                    >
                                                        {i18n.t('pages.settings.access-token.delete')}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                            {
                                tokenList && tokenList.length === 0 &&
                                <p className="norecord">{i18n.t('common.table-no-data')}</p>
                            }
                        </Col>
                    </Row>
                </Container>
            </Section>
        </Row>
        <ConfirmPrompt
            show={isShowDeleteAlert}
            title={i18n.t('common.are-you-sure')}
            cancelBtnText={i18n.t('common.buttons.cancel')}
            confirmBtnText={i18n.t('common.delete-it')}
            contentText={i18n.t('common.delete-tip')}
            onConfirm={deleteToken}
            onCancel={() => setIsShowDeleteAlert(false)}
            onHide={() => setIsShowDeleteAlert(false)}
        />
    </Container>
}

export default AccessToken;
