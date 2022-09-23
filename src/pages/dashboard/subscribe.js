import ApiConfig from 'APIs/config';
import enums from 'Enums';
import * as utils from 'Utils';

class Subscribe {
    sseApi = `${ApiConfig.notificationService}/subscribe/status-sse`;
    scanningTaskIds = [];

    constructor({projectList, setProjectList, setSseSuccessfulScanTaskId}) {
        this.projectList = projectList;
        this.setProjectList = setProjectList;
        this.setSseSuccessfulScanTaskId = setSseSuccessfulScanTaskId;

        this.projectList.forEach(project => {
            const lastScanTask = project.lastScanTask || {};
            if([
                enums.SCAN_TASK_STATUS.pending, 
                enums.SCAN_TASK_STATUS.processing
            ].includes(lastScanTask.status)) {
                this.scanningTaskIds.push(lastScanTask.id);
            }
        });
    }

    start = () => {
        if(this.scanningTaskIds.length === 0) {
            return;
        }

        const params = this.scanningTaskIds.map(id => `scanTaskId=${id}`);
        const url = this.sseApi + '?' + params.join('&');

        this.source = new EventSource(url);
        this.source.onopen = this._onopen;
        this.source.onmessage = this._onmessage;
        this.source.onerror = this._onerror;
    }

    close = () => {
        this.source && this.source.close();
    }

    _onopen = event => {
        // Nothing
    }

    _onmessage = event => {
        if(!utils.isJsonString(event.data)) return;
        const sseData = JSON.parse(event.data);
        this._updateScanningStatus(sseData);
    }

    _onerror = event => {
        // Nothing
    }

    _updateScanningStatus = (sseData) => {
        const project = this.projectList.find(project => (project.lastScanTask || {}).id === sseData.scanTaskId);
        if(!project) return;

        switch(sseData.status) {
            case enums.NOTIFICATION_TASK_STATUS.SUCCESS:
                if(sseData.source === enums.NOTIFICATION_TASK.POSTPROC) {
                    this.setSseSuccessfulScanTaskId(sseData.scanTaskId);
                }
                break;
            case enums.NOTIFICATION_TASK_STATUS.CANCEL:
                project.isScanning = false;
                project.scanningStatus = sseData.status;
                this.setProjectList(this.projectList);
                break;
            case enums.NOTIFICATION_TASK_STATUS.FAILED:
            case enums.NOTIFICATION_TASK_STATUS.FATAL:
                project.isScanning = false;
                project.scanningStatus = sseData.status;
                project.lastScanTask.scanEndAt = sseData.dateTime;
                this.setProjectList(this.projectList);
                break;
            default:
                break;
        }
    }
}

export default Subscribe;