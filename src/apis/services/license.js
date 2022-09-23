import axios from "APIs/axios";
import Config from 'APIs/config';

const license = {
    async getLicense() {
        let callback = {};
        try {
            callback = await axios.get(`${Config.licenseService}/license`);
        } catch (e) {
            return {
                error: e
            };
        }
        return callback.data;
    },

    async uploadLicense(formData) {
        let callback = {};
        try {
            callback = await axios.post(`${Config.licenseService}/license`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
        } catch (e) {
            return {
                error: e
            };
        }
        return callback.data;
    },
};
export default license;
