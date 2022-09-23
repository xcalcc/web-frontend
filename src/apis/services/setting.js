import axios from "APIs/axios";
import Config from 'APIs/config';

const setting = {
    async getRetentionPeriod() {
        let callback = {};
        let url = `${Config.settingService}/setting/retention_period`;
        try {
            callback = await axios.get(url);
        } catch (e) {
            return {
                error: e
            };
        }
        return callback.data;
    },
    async saveRetentionPeriod(retentionPeriod) {
        let callback = {};
        try {
            callback = await axios.post(
                `${Config.settingService}/setting/retention_period`, {
                    retentionPeriod
                }
            );
        } catch (e) {
            return {
                error: e
            };
        }
        return callback.data;
    },
    async getSetting(key) {
        let callback = {};
        let url = `${Config.settingService}/setting/${key}`;
        try {
            callback = await axios.get(url);
        } catch (e) {
            return {
                error: e
            };
        }
        return callback.data;
    },
    async updateSetting({key, value}) {
        let callback = {};
        try {
            callback = await axios.put(
                `${Config.settingService}/setting`, {
                    settingKey: key,
                    settingValue: value
                }
            );
        } catch (e) {
            return {
                error: e
            };
        }
        return callback.data;
    },
    async getEmailConfiguration() {
        let callback = {};
        let url = `${Config.settingService}/setting/email_server_configuration`;
        try {
            callback = await axios.get(url);
        } catch (e) {
            return {
                error: e
            };
        }
        return callback.data;
    },
    async updateEmailConfiguration(data) {
        let callback = {};
        try {
            callback = await axios.post(
                `${Config.settingService}/setting/email_server_configuration`, data
            );
        } catch (e) {
            return {
                error: e
            };
        }
        return callback.data;
    },
};
export default setting;
