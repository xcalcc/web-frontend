import axios from "APIs/axios";
import Config from 'APIs/config';

const auth = {
    async login(username, password) {
        let callback = {};
        try {
            callback = await axios.post(`${Config.authService}/login`, {
                username,
                password
            });
        } catch (e) {
            return {
                error: e
            };
        }
        return callback.data;
    },

    async generateAccessToken(tokenName, expireDays) {
        let callback = {};
        try {
            callback = await axios.post(`${Config.authService}/generate_access_token`, {
                tokenName,
                expireDays
            });
        } catch (e) {
            return {
                error: e
            };
        }
        return callback.data;
    },

    async getAccessTokenList() {
        let callback = {};
        try {
            callback = await axios.get(`${Config.authService}/access_tokens`);
        } catch (e) {
            return {
                error: e
            };
        }
        return callback.data;
    },

    async deleteAccessToken(id) {
        let callback = {};
        try {
            callback = await axios.delete(`${Config.authService}/access_token/${id}`);
        } catch (e) {
            return {
                error: e
            };
        }
        return callback.data;
    },
}

export default auth;