import React from 'react';
import {Row, Col} from 'react-bootstrap';
import {PlusSquareFill} from "react-bootstrap-icons";
import i18n from 'i18next';
import * as utils from "Utils";
import {XFormGroup} from 'Components/Form';
import XButton from 'Components/Button';
import InputWithEdit from '../InputWithEdit';

const ConfigWithCustom = props => {
    const {
        pageData,
        updatePageData
    } = props;

    const handleCustomConfigAdd = () => {
        let { customConfigList } = pageData;
        customConfigList.push({
            id: utils.getRandom(),
            name: '',
            value: ''
        });
        updatePageData({customConfigList});
    }

    const handleConfigInputChange = (e, data, fieldName)=> {
        const input = e.target;
        let { customConfigList } = pageData;
        customConfigList.forEach(item => {
            if(item.id === data.id) {
                item[fieldName] = input.value;
            }
        });
        updatePageData({customConfigList});
    }

    return (
        <>
            {
                pageData.customConfigList.map(item => {
                    return (
                        <XFormGroup key={item.id}>
                            <Row>
                                <Col md={6}>
                                    <InputWithEdit 
                                        name="customConfigName"
                                        placeholder={i18n.t('project.enter-name')}
                                        value={item.name}
                                        className={item.name === '' ? '' : 'as-label'}
                                        onChange={e => handleConfigInputChange(e, item, 'name')}
                                    />
                                </Col>
                                <Col md={6}>
                                    <InputWithEdit 
                                        name="customConfigValue"
                                        placeholder={i18n.t('project.enter-value')}
                                        value={item.value}
                                        className={item.value === '' ? '' : 'as-label'}
                                        onChange={e => handleConfigInputChange(e, item, 'value')}
                                    />
                                </Col>
                            </Row>
                        </XFormGroup>
                    )
                })
            }
            <Row>
                <Col>
                    <XButton 
                        label={i18n.t('project.add')} 
                        icon={<PlusSquareFill/>}
                        className="gradigent"
                        onClick={handleCustomConfigAdd}
                    />
                </Col>
            </Row>
        </>
    )
}

export default ConfigWithCustom;