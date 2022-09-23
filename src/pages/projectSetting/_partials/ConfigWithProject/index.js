import React, {useState, useMemo} from 'react';
import i18n from 'i18next';
import enums from 'Enums';
import {XFormGroup} from 'Components/Form';
import TooltipWrapper from "Components/TooltipWrapper";
import InputWithEdit from '../InputWithEdit';

const ConfigWithProject = props => {
    const {
        pageData,
        errors,
        onChange,
        onKeyUp
    } = props;

    const [isgit, setIsgit] = useState(false);
    const [isgerrit, setIsgerrit] = useState(false);

    useMemo(() => {
        const _isgit = enums.SCM_TYPE_LIST.findIndex(x => pageData.sourceStorageType === x.value) > -1;
        const _isgerrit = pageData.sourceStorageType === enums.FILE_STORAGE_TYPE.gerrit;

        setIsgit(_isgit);
        setIsgerrit(_isgerrit);
    }, [pageData.sourceStorageName]);

    return (
        <>
            <XFormGroup 
                layout="horizontal"
                label={i18n.t('project.project-language')}
            >
                <TooltipWrapper
                    tooltipText={i18n.t('project.not-edit-tip')}
                    options={{placement: 'top'}}
                >
                    <span className="config-value">{pageData.lang}</span>
                </TooltipWrapper>
            </XFormGroup>

            <XFormGroup 
                layout="horizontal"
                label={i18n.t('project.project-name')}
                error={errors.projectName}
            >
                <InputWithEdit 
                    name="projectName"
                    onChange={onChange}
                    onKeyUp={onKeyUp}
                    value={pageData.projectName}
                />
            </XFormGroup>

            <XFormGroup 
                layout="horizontal"
                label={i18n.t('project.project-id')}
                error={errors.projectId}
            >
                <TooltipWrapper
                    tooltipText={i18n.t('project.not-edit-tip')}
                    options={{placement: 'top'}}
                >
                    <span className="config-value">{pageData.projectId}</span>
                </TooltipWrapper>
            </XFormGroup>

            {
                isgit &&
                <XFormGroup 
                    layout="horizontal"
                    label={i18n.t('project.source-url')}
                    error={errors.gitUrl}
                >
                    <InputWithEdit 
                        name="gitUrl"
                        onChange={onChange}
                        onKeyUp={onKeyUp}
                        value={pageData.gitUrl}
                    />
                </XFormGroup>
            }

            {
                isgerrit &&
                <XFormGroup 
                    layout="horizontal"
                    label={i18n.t('project.gerrit-project-id')}
                    error={errors.gerritProjectId}
                >
                    <InputWithEdit 
                        name="gerritProjectId"
                        onChange={onChange}
                        onKeyUp={onKeyUp}
                        value={pageData.gerritProjectId}
                    />
                </XFormGroup>
            }
            {
                isgerrit &&
                <XFormGroup 
                    layout="horizontal"
                    label={i18n.t('project.gerrit-username')}
                    error={errors.username}
                >
                    <InputWithEdit 
                        name="username"
                        onChange={onChange}
                        onKeyUp={onKeyUp}
                        value={pageData.username}
                    />
                </XFormGroup>
            }

            {
                isgit &&
                <XFormGroup 
                    layout="horizontal"
                    label={i18n.t('project.access-token')}
                    error={errors.token}
                >
                    <InputWithEdit 
                        name="token"
                        onChange={onChange}
                        onKeyUp={onKeyUp}
                        value={pageData.token}
                    />
                </XFormGroup>
            }

            {
                isgit && 
                <XFormGroup 
                    layout="horizontal"
                    label={i18n.t('project.branch')}
                    error={errors.branch}
                >
                    <InputWithEdit 
                        name="branch"
                        onChange={onChange}
                        onKeyUp={onKeyUp}
                        value={pageData.branch}
                    />
                </XFormGroup>
            }

            <XFormGroup 
                layout="horizontal"
                label={i18n.t('project.source-code-path')}
                error={errors.relativeSourcePath}
            >
                <InputWithEdit 
                    name="relativeSourcePath"
                    onChange={onChange}
                    onKeyUp={onKeyUp}
                    value={pageData.relativeSourcePath}
                />
            </XFormGroup>

            <XFormGroup 
                layout="horizontal"
                label={i18n.t('project.build-file-path')}
                error={errors.relativeBuildPath}
            >
                <InputWithEdit 
                    name="relativeBuildPath"
                    onChange={onChange}
                    onKeyUp={onKeyUp}
                    value={pageData.relativeBuildPath}
                />
            </XFormGroup>
        </>
    );
}

export default ConfigWithProject;