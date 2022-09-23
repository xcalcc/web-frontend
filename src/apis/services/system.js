import axios from "APIs/axios";
import Config from 'APIs/config';

const system = {
    async contactUs({name, email, content}) {
        let callback = {};
        try {
            callback = await axios.post(
                `${Config.systemService}/contact_us`, {
                    name,
                    email,
                    content
                }
            );
        } catch (e) {
            return {
                error: e
            };
        }
        return callback.data;
    },
    async getVersion() {
        let callback = {};
        try {
            callback = await axios.get("/actuator/info");
        } catch (e) {
            return {
                error: e
            };
        }
        return callback.data;
    },
};
export default system;
