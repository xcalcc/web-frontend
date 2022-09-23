import React, {useMemo} from 'react';
import {Row, Col} from 'react-bootstrap';
import i18n from 'i18next';
import enums from 'Enums';
import {XFormGroup, XDropdown, XInput} from 'Components/Form';

const ConfigWithC = props => {
    const {
        errors,
        pageData,
        onChange,
        onKeyUp,
        onSelectBuild
    } = props;

    const buildTools = enums.BUILD_TOOLS.C;

    const hasOtherBuildValue = useMemo(() => {
        return !!pageData.build && buildTools.findIndex(x => x.value === pageData.build) === -1; 
    }, [pageData.build]);

    const defaultBuild = useMemo(() => {
        if(pageData.isSelectedOtherBuild || hasOtherBuildValue) return i18n.t('project.other');
        const data = buildTools.find(x => x.value === pageData.build) || {};
        return data.label;
    }, [pageData.build, pageData.isSelectedOtherBuild]);

    return (
        <>
            {/* build tools */}
            <XFormGroup 
                label={i18n.t('project.build-tool')}
                error={pageData.isSelectedOtherBuild ? null : errors.build}
            >
                <Row>
                    <Col md="7">
                        <XDropdown
                            name="build"
                            placeholder={i18n.t('project.select-build-tool')}
                            value={defaultBuild}
                            options={
                                buildTools.map(item => ({
                                    label: item.label,
                                    value: item
                                }))
                            }
                            onSelect={onSelectBuild}
                        />
                    </Col>
                </Row>
            </XFormGroup>

            {/* other build */}
            {
                (pageData.isSelectedOtherBuild || hasOtherBuildValue) &&
                <XFormGroup 
                    label={i18n.t('project.other-build-tool')}
                    error={errors.build}
                >
                    <XInput 
                        name="build"
                        placeholder={i18n.t('project.other-build-tool')}
                        onChange={onChange}
                        onKeyUp={onKeyUp}
                        defaultValue={pageData.build}
                    />
                </XFormGroup>
            }

            {/* build config */}
            {
                pageData.hasBuilderPath && 
                <XFormGroup 
                    label={i18n.t('project.build-tool-path')}
                    error={errors.builderPath}
                >
                    <XInput 
                        name="builderPath"
                        placeholder={i18n.t('project.build-tool-path')}
                        onChange={onChange}
                        onKeyUp={onKeyUp}
                        defaultValue={pageData.builderPath}
                    />
                </XFormGroup>
            }

            <XFormGroup 
                label={i18n.t('project.build-opt')}
                hint={i18n.t('project.build-opt-hint')}
                error={errors.buildArgs}
            >
                <XInput 
                    name="buildArgs"
                    placeholder={i18n.t('project.build-opt')}
                    onChange={onChange}
                    onKeyUp={onKeyUp}
                    defaultValue={pageData.buildArgs}
                />
            </XFormGroup>

            <XFormGroup 
                label={i18n.t('project.configure-command')}
                error={errors.prebuildCommand}
            >
                <XInput 
                    name="prebuildCommand"
                    placeholder={i18n.t('project.configure-command')}
                    onChange={onChange}
                    onKeyUp={onKeyUp}
                    defaultValue={pageData.prebuildCommand}
                />
            </XFormGroup>

            <XFormGroup 
                label={i18n.t('project.memory-limit-title')}
                hint={i18n.t('project.memory-limit-hint-c', {limit: enums.MEMORY_LIMIT_C, increase: enums.MEMORY_INCREASE_C})}
                error={errors.scanMemLimit}
            >
                <XInput 
                    name="scanMemLimit"
                    placeholder={i18n.t('project.memory-limit', {limit: enums.MEMORY_LIMIT_C})}
                    onChange={onChange}
                    onKeyUp={onKeyUp}
                    defaultValue={pageData.scanMemLimit} 
                />
            </XFormGroup>
        </>
    )
}

export default ConfigWithC;