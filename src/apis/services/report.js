import axios from "APIs/axios";
import Config from 'APIs/config';

const report = {
    async getDetailReport({payload, fileType, reportType, isDsr, timezoneInMins}) {
        let callback = {};
        try {
            callback = await axios.post(`${Config.reportService}/issue_report/format/${fileType}/type/${reportType}/delta/${isDsr}`, payload, {
                responseType: "blob",
                params: {
                    timezoneInMins
                }
            });
        } catch (e) {
            return {
                error: e
            };
        }
        return callback;
    },

    async getSummaryReport(reportFilterPayload) {
        let callback = {};
        try {
            callback = await axios.post(`${Config.reportService}/issue_report/pdf`, reportFilterPayload);
            return callback.data;
        } catch (e) {
            return {
                error: e
            };
        }
    },
};
export default report;
