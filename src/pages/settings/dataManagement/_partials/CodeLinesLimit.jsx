import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import classNames from 'classnames';
import i18n from 'i18next';
import {Container, Row, Col, Dropdown} from 'react-bootstrap';
import {CaretDownFill, ExclamationTriangleFill} from 'react-bootstrap-icons';
import * as actions from 'Actions';
import enums from 'Enums';
import * as utils from 'Utils';
import Loader from 'Components/Loader';

const CodeLinesLimit = props => {
    const dispatch = useDispatch();

    const [codeDisplayLines, setCodeDisplayLines] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const alertError = error => {
        dispatch(actions.pushAlert({
            type: 'error',
            title: i18n.t('common.notifications.failure'),
            content: utils.getApiMessage(error)
        }));
    }

    const updateCodeDisplayLines = async (lines) => {
        setIsLoading(true);
        setCodeDisplayLines(lines);
        const callback = await dispatch(actions.updateUserConfig({configNumCodeDisplay: lines}));
        if(callback.error) {
            alertError(callback.error);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        (async () => {
            setIsLoading(true);

            const userConfig = await dispatch(actions.fetchUserConfig());

            if(userConfig.error) {
                alertError(userConfig.error);
            } else {
                setCodeDisplayLines(userConfig.configNumCodeDisplay);
            }

            setIsLoading(false);
        })();
    }, []);

    return <Container fluid className="settings-content noPadding">
        {isLoading && <Loader/>}
        <Row noGutters>
            <Col md={7}>
                <div className="settings-content-title">
                    {i18n.t('pages.settings.maximum-line')}
                </div>
                <div className="settings-content-description">
                    {
                        codeDisplayLines === null &&
                        <Row noGutters>
                            <Col md={1}>
                                <span><ExclamationTriangleFill className="warning"/></span>
                            </Col>
                            <Col md={11} className="settings-content-description-text">
                                {i18n.t('pages.settings.unlimited-hint')}
                            </Col>
                        </Row>
                    }
                </div>
            </Col>
            <Col md={{span: 3, offset: 2}}>
                <p className="settings-content-options-title">{i18n.t('pages.settings.line-of-code-dropdown-title')}</p>
                <Dropdown>
                    <Dropdown.Toggle variant="custom" id="dropdown-code-display-lines">
                        <span>
                            {codeDisplayLines === null && i18n.t('pages.settings.unlimited')}
                            {codeDisplayLines > 0 && `${codeDisplayLines} ${i18n.t('pages.settings.lines')}`}
                        </span>
                        <span className="down-arrow-icon">
                            <CaretDownFill/>
                        </span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {
                            enums.CODE_DISPLAY_LINE_OPTIONS.map((item, idx) => {
                                return <Dropdown.Item
                                    key={idx}
                                    onSelect={() => updateCodeDisplayLines(item)}
                                    className={classNames({"selected": item === codeDisplayLines})}
                                >
                                    {item === null && i18n.t('pages.settings.unlimited')}
                                    {item > 0 && `${item} ${i18n.t('pages.settings.lines')}`}
                                </Dropdown.Item>;
                            })
                        }
                    </Dropdown.Menu>
                </Dropdown>
            </Col>
        </Row>
    </Container>
}

export default CodeLinesLimit;