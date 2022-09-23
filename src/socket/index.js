import {io, Manager} from 'socket.io-client';
import * as utils from "Utils";
import store from 'Store';
import * as actions from 'Actions';

//todo reconnect mechanism
//todo create new socket when server changed

// localStorage.debug = '*';
const customEvents = {
    'scan-status': (data, scanTaskId = 'test') => {
        if (data[scanTaskId]) {
            store.dispatch(actions.writeScanProgress(scanTaskId, {
                currentStatus: data[scanTaskId].currentStatus,
                percentage: data[scanTaskId].percentage,
            }));
        }
    },
    'update-status-error': err => {
        console.log('WS: update-status-error', err);
    }
}

// const manager = new Manager(wsUrl.replace(/'http'/, 'ws'), {
//     reconnectionDelay: 1000,
//     transports: ['websocket', 'polling'],
// });

// let socket = manager.connect();

// manager.on('error', error => {
//     if(error) {
//         console.log(`Manager: WS is connected to ${manager.uri} error`);
//         const wsUrl = utils.localStore.get('agentURL') || '';
//         manager.uri = wsUrl.replace(/'http'/, 'ws');
//         socket = manager.connect();
//         // connectSocketEvents(socket);
//     }
// });

class Socket {
    constructor(nsp) {
        this._nsp = nsp || '/';
        this._jwt = utils.localStore.get("accessToken") || "";
        this.fetchStoredUrl();
    }

    fetchStoredUrl() {
        const storedUri = utils.localStore.get('agentURL') || '';
        this._uri = storedUri && storedUri.replace('http', 'ws');
    }

    connectSocketEvents() {
        this._socket.on('connect_error', error => {
            console.log(`WS is connected to ${this._uri} error`, error);
        });

        this._socket.on('disconnect', reason => {
            switch (reason) {
                case 'io server disconnect':
                    console.log(`WS Disconnected from ${this._uri} for reason: ${reason}`);
                    this._socket.connect();
                    break;
                case 'io client disconnect':
                case 'ping timeout':
                case 'transport close':
                case 'transport error':
                    console.log(`WS Disconnected from ${this._uri} for reason: ${reason}`);
                    break;
            }
        });
        this._socket.on('connect', () => {
            console.log(`WS Disconnected from ${this._uri}`);
        });

        this._socket.on('welcome', data => {
            console.log(data);
        });

        for (let event in customEvents) {
            this._socket.on(event, customEvents[event]);
        }
    }

    connect(uri) {
        this.fetchStoredUrl();
        this._jwt = utils.localStore.get("accessToken") || "";
        // const uri = `${this._uri}/${this._nsp}`; //with name space
        this._socket = io(uri || this._uri, {
            reconnectionDelay: 10000,
            transports: ['websocket', 'polling'],
            auth: {
                token: this._jwt
            }
        });
        this._socket.connect();
        this.connectSocketEvents();
    }

    reconnect(uri) {
        this.connect(uri);
    }

    disconnect() {
        this._socket.disconnect();
    }

    emit(evt, data) {
        this._socket.emit(evt, data);
    }
}

const socket = new Socket('offline-mode');
socket.connect();

export default socket;
