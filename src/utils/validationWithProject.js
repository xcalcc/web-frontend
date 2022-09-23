import i18n from 'i18next';
import enums from 'Enums';

const validationWithProject = ({formElement, pageData, isCreatePage, stepIndex}) => {
    let inputList = [];
    let validatePageData = ['build'];
    if(isCreatePage) {
        validatePageData = {
            step1: [],
            step2: ['build']
        }
    }

    const validateFieldTagNames = ['text', 'number'];
    const noValidateFieldNames = [
        'token', 
        'buildArgs', 
        'prebuildCommand', 
        'jobQueueName', 
        'customConfigName', 
        'customConfigValue'
    ];

    const elementList = Array.from(formElement.getElementsByTagName('input'));
    inputList = elementList.filter(x => validateFieldTagNames.includes(x.type.toLowerCase()));

    let errors = {};
    const requiredMsg = i18n.t('error.validation.required');

    inputList.forEach(input => {
        if(noValidateFieldNames.includes(input.name)) {
            return;
        }

        if(!input.value) {
            errors[input.name] = requiredMsg;
        }
        else if(input.name === 'scanMemLimit') {
            let memory = parseInt(input.value, 10) || 0;
            if(pageData.lang === 'c++' && (memory < enums.MEMORY_LIMIT_C || !/^\d+$/.test(input.value))) {
                errors[input.name] = i18n.t('error.validation.memory-limit', {limit: enums.MEMORY_LIMIT_C});
            }
            if(pageData.lang === 'java' && (memory < enums.MEMORY_LIMIT_JAVA || !/^\d+$/.test(input.value))) {
                errors[input.name] = i18n.t('error.validation.memory-limit', {limit: enums.MEMORY_LIMIT_JAVA});
            }
        }
    });

    const validateCurrentStep = (isCreatePage ? validatePageData[`step${stepIndex}`] : validatePageData) || [];
    validateCurrentStep.forEach(field => {
        if(!pageData[field]) {
            errors[field] = requiredMsg;
        }
    });

    return [Object.values(errors).length > 0, errors];
}

export default validationWithProject;