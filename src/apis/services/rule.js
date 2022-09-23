import axios from "APIs/axios";
import Config from 'APIs/config';

const rule = {
    async getRuleInformationList() {
        try {
            let callback, url = `${Config.ruleService_micro}/rule/rule_list`;
            callback = await axios.get(url);

            return callback.data;
        } catch (e) {
            console.error(e);
            return [];
        }
    },


    async getStandardMap(standardName) {
        try {
            let url = `${Config.ruleService_micro}/rule/standard/${standardName.toLowerCase()}`;
            const callback = await axios.get(url);
            return callback.data;
        } catch (e) {
            console.error(e);
            return [];
        }
    },

    async getStandards() {
        try {
            let url = `${Config.ruleService_micro}/rule/standards`;
            const callback = await axios.get(url);
            return callback.data;
        } catch (e) {
            return {
                error: e
            };
        }
    },

    async getRuleSetById(id) {
        let url = `${Config.ruleService_micro}/rule/rule_set/${id}`;
        return await axios.get(url);
    },

    async getRuleSets() {
        let callback = {};
        let url = `${Config.ruleService_micro}/rule/rule_sets`;
        try {
            callback = await axios.get(url);
            return callback.data;
        } catch (e) {
            return {
                error: e
            };
        }
    },

    async getRuleStandardList(ruleStandardSetName) {
        try {
            let url = `${Config.ruleService_micro}/rule/rule_standard/rule_standard_set/${ruleStandardSetName}`;
            return await axios.get(url);
        } catch (e) {
            console.error(e);
            return [];

        }
    },

    async getRuleInformationById(id) {
        try {
            let url = `${Config.ruleService_micro}/rule/rule_info/${id}`;
            return await axios.get(url);
        } catch (e) {
            console.error(e);
            return [];

        }
    },

    async fetchRuleCodeNameMap() {
        let callback = {};
        let url = `${Config.ruleService_micro}/rule/rule-info/all`;
        try {
            callback = await axios.get(url);
            return callback.data;
        } catch (e) {
            console.error(e);
            return {};
        }
    },

    async fetchPathMsg() {
        let callback = {};
        let url = `${Config.ruleService_micro}/rule/path_msg`;
        try {
            callback = await axios.get(url);
            return callback.data;
        } catch (e) {
            console.error(e);
            return [];
        }
    },

    async getCustomRuleMap(projectKey) {
        let callback = {};
        let url = `${Config.ruleService_micro}/rule/custom/${projectKey}`;
        try {
            callback = await axios.get(url);
            return callback.data;
        } catch (e) {
            return {
                error: e
            };
        }
    },
}

export default rule;
