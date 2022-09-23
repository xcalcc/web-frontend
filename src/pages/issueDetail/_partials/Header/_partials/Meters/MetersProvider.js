import i18n from 'i18next';
import enums from 'Enums';

export class MetersProvider {
    provider = issueGroup => {
        const severityData = this._getSeverityData(issueGroup.severity);
        const likelihoodData = this._getLikelihoodData(issueGroup.likelihood);
        const remediationCostData = this._getRemediationCostData(issueGroup.remediationCost);
        const complexityData = this._getComplexityData(issueGroup.complexity);

        return [
            severityData,
            likelihoodData,
            remediationCostData,
            complexityData
        ];
    }

    _getSeverityData = (severity) => {
        let value;
        let valueName;
        let valueNameClass;

        switch (severity) {
            case enums.ISSUE_SEVERITY.low:
                value = 30;
                valueName = i18n.t('issueDetail.level.LOW');
                valueNameClass = 'lightblue-txt';
                break;
            case enums.ISSUE_SEVERITY.medium:
                value = 90;
                valueName = i18n.t('issueDetail.level.MEDIUM');
                valueNameClass = 'orange-txt';
                break;
            case enums.ISSUE_SEVERITY.high:
                value = 150;
                valueName = i18n.t('issueDetail.level.HIGH');
                valueNameClass = 'red-txt';
                break;
            default:
                value = 0;
                valueName = i18n.t('issueDetail.unknown');
                valueNameClass = '';
                break;
        }

        return {
            value,
            valueName,
            valueNameClass,
            title: i18n.t('issueDetail.severity')
        };
    }

    _getLikelihoodData = (likelihood) => {
        let value;
        let valueName;
        let valueNameClass;
    
        switch (likelihood) {
            case enums.LIKELIHOOD.unlikely:
                value = 30;
                valueName = i18n.t('issueDetail.level.LOW');
                valueNameClass = 'lightblue-txt';
                break;
            case enums.LIKELIHOOD.probable:
                value = 90;
                valueName = i18n.t('issueDetail.level.MEDIUM');
                valueNameClass = 'orange-txt';
                break;
            case enums.LIKELIHOOD.likely:
                value = 150;
                valueName = i18n.t('issueDetail.level.HIGH');
                valueNameClass = 'red-txt';
                break;
            default:
                value = 0;
                valueName = i18n.t('issueDetail.unknown');
                valueNameClass = '';
                break;
        }
    
        return {
            value,
            valueName,
            valueNameClass,
            title: i18n.t('issueDetail.likelihood')
        };
    }

    _getRemediationCostData = (remediationCost) => {
        let value;
        let valueName;
        let valueNameClass;
    
        switch (remediationCost) {
            case enums.REMEDIATION_COST.low:
                value = 30;
                valueName = i18n.t('issueDetail.level.LOW');
                valueNameClass = 'lightblue-txt';
                break;
            case enums.REMEDIATION_COST.medium:
                value = 90;
                valueName = i18n.t('issueDetail.level.MEDIUM');
                valueNameClass = 'orange-txt';
                break;
            case enums.REMEDIATION_COST.high:
                value = 150;
                valueName = i18n.t('issueDetail.level.HIGH');
                valueNameClass = 'red-txt';
                break;
            default:
                value = 0;
                valueName = i18n.t('issueDetail.unknown');
                valueNameClass = '';
                break;
        }
    
        return {
            value,
            valueName,
            valueNameClass,
            title: i18n.t('issueDetail.remediation-cost')
        };
    }

    _getComplexityData = (complexity) => {
        let value;
        let valueName;
        let valueNameClass;
        let complexityVerbal;

        if (complexity >= 0 && complexity < 4) {
            complexityVerbal = 'low';
        } else if (complexity >= 4 && complexity < 7) {
            complexityVerbal = 'medium';
        } else if (complexity >= 7) {
            complexityVerbal = 'high';
        }
    
        switch (complexityVerbal) {
            case 'low':
                value = 30;
                valueName = i18n.t('issueDetail.level.LOW');
                valueNameClass = 'lightblue-txt';
                break;
            case 'medium':
                value = 90;
                valueName = i18n.t('issueDetail.level.MEDIUM');
                valueNameClass = 'orange-txt';
                break;
            case 'high':
                value = 150;
                valueName = i18n.t('issueDetail.level.HIGH');
                valueNameClass = 'red-txt';
                break;
            default:
                value = 0;
                valueName = i18n.t('issueDetail.unknown');
                valueNameClass = '';
                break;
        }
    
        return {
            value,
            valueName,
            valueNameClass,
            title: i18n.t('issueDetail.complexity')
        };
    }
}