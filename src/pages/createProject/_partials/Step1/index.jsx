import React from 'react';
import {Row, Col, Form} from 'react-bootstrap';
import i18n from 'i18next';
import XButton from 'Components/Button';
import {XFormGroup, XRadio, XInput} from 'Components/Form';

const Step1 = props => {
    const {
        isEdit,
        errors,
        setErrors,
        pageData,
        updatePageData,
        onChange,
        onKeyUp,
        onSubmit
    } = props;

    const random8Suffix = Date.now().toString().slice(5, 13);
    const handleProjectNameEnter = (e) => {
        if(isEdit) return;
        const input = e.target;
        let value = (input.value || '').replace(/[^A-Z0-9]+/gi, '').toLowerCase();
        updatePageData({projectId: `${value}${random8Suffix}`});
    }

    const validateProjectName = projectName => {
        //Proj name – limited to number, english characters, space and <51 characters. No symbol is allowed.
        const reg = /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/gi;
        if(projectName.length > 50 || !reg.test(projectName)) return false;
        return true;
    }

    const handleSubmit = event => {
        event.preventDefault();
        const form = event.currentTarget;
        const projectNameValue = form.projectName.value;
        if(!validateProjectName(projectNameValue)) {
            setErrors({
                ...errors,
                projectName: i18n.t('error.validation.invalid-project-name')
            });
            return false;
        }
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
        onSubmit(event);
        return true;
    }

    return (
        <>
            <Row noGutters className="justify-content-center">
                <Col md={6}>
                    <h3 className="title">{i18n.t("project.project-information")}</h3>
                </Col>
            </Row>
            <Row noGutters className="justify-content-center">
                <Col md={6}>
                    <Form onSubmit={handleSubmit}>
                        <XFormGroup label={i18n.t('project.project-language')}>
                            <XRadio 
                                name="lang"
                                label="C/C++"
                                value="c++"
                                checked={pageData.lang === 'c++'}
                                onChange={onChange}
                            />
                            <XRadio 
                                name="lang"
                                label="Java"
                                value="java"
                                checked={pageData.lang === 'java'}
                                onChange={onChange}
                            />
                        </XFormGroup>

                        <XFormGroup 
                            label={i18n.t('project.project-name')}
                            error={errors.projectName}
                        >
                            <XInput 
                                name="projectName"
                                placeholder={i18n.t('project.project-name')}
                                onChange={(e) => {
                                    onChange(e);
                                    handleProjectNameEnter(e);
                                }}
                                onKeyUp={onKeyUp}
                                defaultValue={pageData.projectName}
                            />
                        </XFormGroup>

                        {/*<XFormGroup */}
                        {/*    label={i18n.t('project.project-id')}*/}
                        {/*    error={errors.projectId}*/}
                        {/*>*/}
                        {/*    <XInput */}
                        {/*        name="projectId"*/}
                        {/*        placeholder={i18n.t('project.project-id')}*/}
                        {/*        // onChange={onChange}*/}
                        {/*        value={buildProjectId(pageData.projectName)}*/}
                        {/*        disabled*/}
                        {/*        defaultValue={pageData.projectId}*/}
                        {/*    />*/}
                        {/*</XFormGroup>*/}

                        {/*<XFormGroup label={i18n.t('project.source')}>*/}
                        {/*    <Row>*/}
                        {/*        <Col md="7">*/}
                        {/*            <XDropdown*/}
                        {/*                name="sourceStorageName"*/}
                        {/*                value={currentFileStorage.label}*/}
                        {/*                options={*/}
                        {/*                    fileStorageList.map(item => ({*/}
                        {/*                        label: item.label,*/}
                        {/*                        value: item*/}
                        {/*                    }))*/}
                        {/*                }*/}
                        {/*                onSelect={handleSelectSource}*/}
                        {/*            />*/}
                        {/*        </Col>*/}
                        {/*    </Row>*/}
                        {/*</XFormGroup>*/}

                        {/*{*/}
                        {/*    isgit &&*/}
                        {/*    <XFormGroup */}
                        {/*        label={i18n.t('project.source-url')}*/}
                        {/*        error={errors.gitUrl}*/}
                        {/*    >*/}
                        {/*        <XInput */}
                        {/*            name="gitUrl"*/}
                        {/*            placeholder={i18n.t('project.source-url')}*/}
                        {/*            onChange={onChange}*/}
                        {/*            onKeyUp={onKeyUp}*/}
                        {/*            defaultValue={pageData.gitUrl}*/}
                        {/*        />*/}
                        {/*    </XFormGroup>*/}
                        {/*}*/}

                        {/*{*/}
                        {/*    isgerrit &&*/}
                        {/*    <XFormGroup */}
                        {/*        label={i18n.t('project.gerrit-project-id')}*/}
                        {/*        error={errors.gerritProjectId}*/}
                        {/*    >*/}
                        {/*        <XInput */}
                        {/*            name="gerritProjectId"*/}
                        {/*            placeholder={i18n.t('project.gerrit-project-id')}*/}
                        {/*            onChange={onChange}*/}
                        {/*            onKeyUp={onKeyUp}*/}
                        {/*            defaultValue={pageData.gerritProjectId}*/}
                        {/*        />*/}
                        {/*    </XFormGroup>*/}
                        {/*}*/}
                        {/*{*/}
                        {/*    isgerrit &&*/}
                        {/*    <XFormGroup */}
                        {/*        label={i18n.t('project.gerrit-username')}*/}
                        {/*        error={errors.username}*/}
                        {/*    >*/}
                        {/*        <XInput */}
                        {/*            name="username"*/}
                        {/*            placeholder={i18n.t('project.gerrit-username')}*/}
                        {/*            onChange={onChange}*/}
                        {/*            onKeyUp={onKeyUp}*/}
                        {/*            defaultValue={pageData.username}*/}
                        {/*        />*/}
                        {/*    </XFormGroup>*/}
                        {/*}*/}

                        {/*{*/}
                        {/*    isgit &&*/}
                        {/*    <XFormGroup */}
                        {/*        label={i18n.t('project.access-token')}*/}
                        {/*        error={errors.token}*/}
                        {/*    >*/}
                        {/*        <XInput */}
                        {/*            name="token"*/}
                        {/*            placeholder={i18n.t('project.access-token')}*/}
                        {/*            onChange={onChange}*/}
                        {/*            onKeyUp={onKeyUp}*/}
                        {/*            defaultValue={pageData.token}*/}
                        {/*        />*/}
                        {/*    </XFormGroup>*/}
                        {/*}*/}

                        {/*{*/}
                        {/*    isgit && */}
                        {/*    <XFormGroup */}
                        {/*        label={i18n.t('project.branch')}*/}
                        {/*        error={errors.branch}*/}
                        {/*    >*/}
                        {/*        <XInput */}
                        {/*            name="branch"*/}
                        {/*            placeholder={i18n.t('project.branch')}*/}
                        {/*            onChange={onChange}*/}
                        {/*            onKeyUp={onKeyUp}*/}
                        {/*            defaultValue={pageData.branch}*/}
                        {/*        />*/}
                        {/*    </XFormGroup>*/}
                        {/*}*/}

                        <XFormGroup 
                            label={i18n.t('project.source-code-path')}
                            error={errors.relativeSourcePath}
                        >
                            <XInput 
                                name="relativeSourcePath"
                                placeholder={i18n.t('project.source-code-path')}
                                onChange={onChange}
                                onKeyUp={onKeyUp}
                                defaultValue={pageData.relativeSourcePath}
                            />
                        </XFormGroup>

                        <XFormGroup 
                            label={i18n.t('project.build-file-path')}
                            error={errors.relativeBuildPath}
                        >
                            <XInput 
                                name="relativeBuildPath"
                                placeholder={i18n.t('project.build-file-path')}
                                onChange={onChange}
                                onKeyUp={onKeyUp}
                                defaultValue={pageData.relativeBuildPath}
                            />
                        </XFormGroup>

                        <div className="text-right">
                            <XButton
                                red
                                type="submit"
                                label={i18n.t("common.next")}
                            />
                        </div>
                    </Form>
                </Col>
            </Row>
        </>
    )
}

export default Step1;