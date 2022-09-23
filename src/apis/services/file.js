import axios from "APIs/axios";
import Config from 'APIs/config';

const file = {
    async getFileStorageList({
                             page = 0,
                             size = 100
                         } = {}) {
        let callback = {};
        try {
            callback = await axios.get(
                `${Config.fileService}/file_storages`, {
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

    async getDirectoryTree({
        page = 0,
        size = 100,
        scanTaskId,
        scanFileIds = [],
        depth = 2
    } = {}) {
        let data = {
            scanTaskId,
            depth,
            types: ["DIRECTORY"]
        };

        if (scanFileIds) {
            data.scanFileIds = scanFileIds;
        }

        let callback = {};
        try {
            callback = await axios.post(
                `${Config.fileService}/scan_file`, data, {
                    paramsSerializer: function () {
                        let params = [];
                        params.push(`page=${page}`);
                        params.push(`size=${size}`);
                        return params.join("&");
                    }
                }
            );
        } catch (e) {
            return { error: e };
        }
        return callback.data;
    },

    async getScanFile({scanTaskId, dsrType, filePath, fromLineNo = undefined, toLineNo = undefined, linesLimit = undefined}) {
        let callback = {};
        try {
            callback = await axios.post(
                `${Config.fileService}/scan_file/file`, {
                    scanTaskId,
                    dsrType,
                    relativePath: filePath,
                    fromLineNo,
                    toLineNo,
                    linesLimit
                }
            );
        } catch (e) {
            return { error: e };
        }
        return callback;
    }
}

export default file;