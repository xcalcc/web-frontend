import React,{useMemo} from 'react';
import i18n from 'i18next';
import enums from 'Enums';
import {XFormGroup} from 'Components/Form';
import InputWithEdit from '../InputWithEdit';
import DropdownWithEdit from '../DropdownWithEdit';

const ConfigWithScan = props => {
    const {
        pageData,
        errors,
        onChange,
        onKeyUp,
        onSelectBuild
    } = props;

    const buildToolList = pageData.lang.toLocaleLowerCase() === 'java' ? enums.BUILD_TOOLS.JAVA : enums.BUILD_TOOLS.C;

    const hasOtherBuildValue = useMemo(() => {
        return !!pageData.build && buildToolList.findIndex(x => x.value === pageData.build) === -1; 
    }, [pageData.build]);

    const buildTool = useMemo(() => {
        if(pageData.isSelectedOtherBuild || hasOtherBuildValue) return i18n.t('project.other');
        const data = buildToolList.find(x => x.value === pageData.build) || {};
        return data.label;
    }, [pageData.build, pageData.isSelectedOtherBuild]);

    return (
        <>
            <XFormGroup 
                layout="horizontal"
                label={i18n.t('project.build-tool')}
                error={pageData.isSelectedOtherBuild ? null : errors.build}
            >
                <DropdownWithEdit
                    name="build"
                    value={buildTool}
                    options={
                        buildToolList.map(item => ({
                            label: item.label,
                            value: item
                        }))
                    }
                    onSelect={onSelectBuild}
                />
            </XFormGroup>

            {
                (pageData.isSelectedOtherBuild || hasOtherBuildValue) &&
                <XFormGroup 
                    layout="horizontal"
                    label={i18n.t('project.other-build-tool')}
                    error={errors.build}
                >
                    <InputWithEdit 
                        name="build"
                        onChange={onChange}
                        onKeyUp={onKeyUp}
                        value={pageData.build}
                    />
                </XFormGroup>
            }

            {
                pageData.hasBuilderPath && 
                <XFormGroup 
                    layout="horizontal"
                    label={i18n.t('project.build-tool-path')}
                    error={errors.builderPath}
                >
                    <InputWithEdit 
                        name="builderPath"
                        onChange={onChange}
                        onKeyUp={onKeyUp}
                        value={pageData.builderPath}
                    />
                </XFormGroup>
            }

            <XFormGroup 
                layout="horizontal"
                label={i18n.t('project.build-opt')}
                error={errors.buildArgs}
            >
                <InputWithEdit 
                    name="buildArgs"
                    onChange={onChange}
                    onKeyUp={onKeyUp}
                    value={pageData.buildArgs}
                />
            </XFormGroup>

            {
                pageData.lang === 'c++' && 
                <XFormGroup 
                    layout="horizontal"
                    label={i18n.t('project.configure-command')}
                    error={errors.prebuildCommand}
                >
                    <InputWithEdit 
                        name="prebuildCommand"
                        onChange={onChange}
                        onKeyUp={onKeyUp}
                        value={pageData.prebuildCommand}
                    />
                </XFormGroup>
            }

            <XFormGroup 
                layout="horizontal"
                label={i18n.t('project.memory-limit-title')}
                error={errors.scanMemLimit}
            >
                <InputWithEdit 
                    name="scanMemLimit"
                    onChange={onChange}
                    onKeyUp={onKeyUp}
                    value={pageData.scanMemLimit} 
                />
            </XFormGroup>
        </>
    );
}

export default ConfigWithScan;