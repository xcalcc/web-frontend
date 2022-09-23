import React from 'react';
import {Row, Col} from 'react-bootstrap';
import {PlusSquareFill} from "react-bootstrap-icons";
import i18n from 'i18next';
import * as utils from "Utils";
import {XFormGroup, XInput} from 'Components/Form';
import XButton from 'Components/Button';

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
            <XFormGroup 
                className="custom-config-wrapper"
                label={i18n.t('project.other-configuration')}
            >
                {
                    pageData.customConfigList.map(item => {
                        return (
                            <Row key={item.id}>
                                <Col md={6}>
                                    <XInput 
                                        name="customConfigName"
                                        placeholder={i18n.t('project.enter-name')}
                                        defaultValue={item.name}
                                        onChange={e => handleConfigInputChange(e, item, 'name')}
                                    />
                                </Col>
                                <Col md={6}>
                                    <XInput 
                                        name="customConfigValue"
                                        placeholder={i18n.t('project.enter-value')}
                                        defaultValue={item.value}
                                        onChange={e => handleConfigInputChange(e, item, 'value')}
                                    />
                                </Col>
                            </Row>
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
            </XFormGroup>
        </>
    )
}

export default ConfigWithCustom;