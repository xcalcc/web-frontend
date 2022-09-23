import axios from "APIs/axios";
import Config from 'APIs/config';

const user = {
    async getCurrentUserInfo() {
        let callback = {};
        try {
            callback = await axios.get(`${Config.userService}/current`);
        } catch (e) {
            return {};
        }
        return callback.data;
    },
    async getUserInfo(id) {
        let callback = {};
        try {
            callback = await axios.get(`${Config.userService}/user/${id}`);
        } catch (e) {
            return {};
        }
        return callback.data;
    },
    async updatePassword({id, oldPassword, newPassword}) {
        let callback = {};
        try {
            callback = await axios.put(
                `${Config.userService}/user/${id}/password`, {
                    id,
                    oldPassword,
                    newPassword
                }
            );
        } catch (e) {
            return {};
        }
        return callback.data;
    },
    async updateUser({id, username, displayName, email, isAdmin}) {
        let callback = {};
        try {
            callback = await axios.put(
                `${Config.userService}/user/${id}`, {
                    username,
                    displayName,
                    email,
                    isAdmin
                }
            );
        } catch (e) {
            return {};
        }
        return callback.data;
    },
    async getUserList({page = 0, size = 200} = {}) {
        let callback = {};
        try {
            callback = await axios.get(
                `${Config.userService}/users`, {
                    params: {
                        page,
                        size
                    }
                }
            );
        } catch (e) {
            return {};
        }
        return callback.data;
    },
    async getUserDetailList({page = 0, size = 200} = {}) {
        let callback = {};
        try {
            callback = await axios.get(
                `${Config.userService}/users/details`, {
                    params: {
                        page,
                        size
                    }
                }
            );
        } catch (e) {
            return {};
        }
        return callback.data;
    },
    async createUser({username, displayName, email, password, isAdmin}) {
        let callback = {};
        try {
            callback = await axios.post(
                `${Config.userService}/user`, {
                    username,
                    displayName,
                    email,
                    password,
                    isAdmin
                }
            );
        } catch (e) {
            return {};
        }
        return callback.data;
    },
    async addUserList(userList = []) {
        let callback = {};
        try {
            callback = await axios.post(
                `${Config.userService}/users`, userList
            );
        } catch (e) {
            return {};
        }
        return callback.data;
    },
    async importUsers(formData) {
        let callback = {};
        try {
            callback = await axios.post(`${Config.userService}/users`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
        } catch (e) {
            return {};
        }
        return callback.data;
    },
    async deleteUser(id) {
        let callback = {};
        try {
            callback = await axios.delete(`${Config.userService}/user/${id}`);
        } catch (e) {
            return {};
        }
        return callback.data;
    },
    async unlockUser(id) {
        let callback = {};
        try {
            callback = await axios.post(`${Config.userService}/user/${id}/action/unlock`);
        } catch (e) {
            return {};
        }
        return callback.data;
    },
    async getAssigneeList({projectUuid, scanTaskId, dsrType, ruleSets}) {
        let callback = {};
        try {
            callback = await axios.post(
                `${Config.userService}/project/${projectUuid}/top_assignees`, 
                {
                    scanTaskId,
                    dsrType,
                    ruleSets
                }
            );
        } catch (e) {
            return {
                error: e
            };
        }
        return callback.data;
    },
    async getUserConfig() {
        let callback = {};
        try {
            callback = await axios.get(`${Config.userService}/config`);
        } catch (e) {
            return {
                error: e
            };
        }
        return callback.data;
    },
    async updateUserConfig({configNumCodeDisplay}) {
        let callback = {};
        try {
            callback = await axios.put(`${Config.userService}/config`, {
                configNumCodeDisplay
            });
        } catch (e) {
            return {
                error: e
            };
        }
        return callback.data;
    },
}

export default user;