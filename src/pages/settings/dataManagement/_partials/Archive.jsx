import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import classNames from 'classnames';
import {CaretDownFill} from 'react-bootstrap-icons';
import * as actions from 'Actions';
import i18n from 'i18next';
import enums from 'Enums';
import * as utils from "Utils";
import {Container, Row, Col, Dropdown} from 'react-bootstrap';
import Loader from 'Components/Loader';

const DataRetention = props => {
    const dispatch = useDispatch();
    const [currRetentionPeriod, setCurrRetentionPeriod] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const saveRetentionPeriod = async (item) => {
        setIsLoading(true);
        setCurrRetentionPeriod(item);
        await dispatch(actions.saveRetentionPeriod(item.value));
        setIsLoading(false);
    }

    useEffect(() => {
        (async () => {
            setIsLoading(true);

            const response = await dispatch(actions.fetchRetentionPeriod());

            if(response.error) {

                dispatch(actions.pushAlert({
                    type: 'error',
                    title: i18n.t('common.notifications.failure'),
                    content: utils.getApiMessage(response.error)
                }));

            } else {

                let retentionPeriod = enums.DATA_RETENTION_OPTIONS.find(x => x.value === response.retentionPeriod);

                if(!retentionPeriod) {
                    retentionPeriod = {
                        label: response.retentionPeriod,
                        value: response.retentionPeriod,
                        suffix: 'days'
                    }
                }

                setCurrRetentionPeriod(retentionPeriod);
            }

            setIsLoading(false);
        })();
    }, []);

    return <>
        {isLoading && <Loader/>}
        <Container fluid className="settings-content noPadding">
            <Row noGutters>
                <Col md={7}>
                    <div className="settings-content-title">
                        {i18n.t('pages.settings.data-management.archive.description')}
                    </div>
                </Col>
                <Col md={{span: 3, offset: 2}}>
                    <p className="settings-content-options-title">{i18n.t('pages.settings.data-management.archive.dropdown-title')}</p>
                    <Dropdown>
                        <Dropdown.Toggle variant="custom" id="dropdown-code-display-lines">
                            <span>
                                {currRetentionPeriod.label} &nbsp;
                                {currRetentionPeriod.suffix && i18n.t(`pages.settings.data-management.archive.${currRetentionPeriod.suffix}`)}
                            </span>
                            <span className="down-arrow-icon">
                                <CaretDownFill/>
                            </span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {
                                enums.DATA_RETENTION_OPTIONS.map((item, idx) => {
                                    return <Dropdown.Item
                                            key={idx}
                                            onSelect={() => saveRetentionPeriod(item)}
                                            className={classNames({"selected" :currRetentionPeriod.value === item.value})}
                                        >
                                        {item.label} {item.suffix && i18n.t(`pages.settings.data-management.archive.${item.suffix}`)}
                                    </Dropdown.Item>;
                                })
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            </Row>
        </Container>
    </>
}

export default DataRetention;