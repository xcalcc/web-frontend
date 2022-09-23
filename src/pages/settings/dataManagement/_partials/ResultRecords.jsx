import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import i18n from 'i18next';
import {Container, Row, Col} from 'react-bootstrap';
import {ExclamationTriangleFill} from 'react-bootstrap-icons';
import * as actions from 'Actions';
import * as utils from 'Utils';
import Loader from 'Components/Loader';
import {XInput} from 'Components/Form';

const ResultRecords = props => {
    const SETTING_KEY = 'retention_num';

    const dispatch = useDispatch();

    const [resultRecords, setResultRecords] = useState();
    const [tempResultRecords, setTempResultRecords] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const alertError = error => {
        dispatch(actions.pushAlert({
            type: 'error',
            title: i18n.t('common.notifications.failure'),
            content: utils.getApiMessage(error)
        }));
    }

    const handleChange = event => {
        let value = event.target.value;
        value = value.replace(/[^0-9]/g, '');
        setTempResultRecords(value);
    }

    const updateResultRecords = async () => {
        if(tempResultRecords === '' || !Number(tempResultRecords)) {
            setTempResultRecords(resultRecords);
            return;
        }

        if(tempResultRecords === resultRecords) return;

        setIsLoading(true);
        const callback = await dispatch(actions.updateSetting({
            key: SETTING_KEY,
            value: Number(tempResultRecords)
        }));

        if(callback.error) {
            callback.error && alertError(callback.error);
        } else {
            setResultRecords(tempResultRecords);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        (async () => {
            setIsLoading(true);

            const data = await dispatch(actions.fetchSetting(SETTING_KEY));

            if(data.error) {
                alertError(data.error);
                setIsLoading(false);
                return;
            }

            setResultRecords(data.settingValue);
            setTempResultRecords(data.settingValue);

            setIsLoading(false);
        })();
    }, []);

    return <Container fluid className="settings-content noPadding">
        {isLoading && <Loader/>}
        <Row noGutters>
            <Col md={7}>
                <div className="settings-content-title">
                    {i18n.t('pages.settings.data-management.result-records.description', {
                        num: tempResultRecords
                    })}
                </div>
                <div className="settings-content-description">
                    <Row noGutters>
                        <Col md={1}>
                            <span><ExclamationTriangleFill className="warning"/></span>
                        </Col>
                        <Col md={11} className="settings-content-description-text">
                            {i18n.t('pages.settings.data-management.result-records.hint')}
                        </Col>
                    </Row>
                </div>
            </Col>
            <Col md={{span: 3, offset: 2}}>
                <p className="settings-content-options-title">{i18n.t('pages.settings.data-management.result-records.input-title')}</p>
                <XInput 
                    type="number"
                    placeholder={String(resultRecords)}
                    value={tempResultRecords}
                    onChange={handleChange}
                    onBlur={updateResultRecords}
                />
            </Col>
        </Row>
    </Container>
}

export default ResultRecords;