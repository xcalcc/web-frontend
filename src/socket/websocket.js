import {io, Manager} from 'socket.io-client';
import * as utils from "Utils";
import store from 'Store';
import * as actions from 'Actions';

// localStorage.debug = '*';
const customEvents = {
    'scan-status': (data, scanTaskId='test') => {
        if(data[scanTaskId]) {
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

const wsUrl = utils.localStore.get('agentURL') || '';
// const manager = new Manager(wsUrl.replace(/'http'/, 'ws'), {
//     reconnectionDelay: 1000,
//     transports: ['websocket', 'polling'],
// });
const socket = io(wsUrl && wsUrl.replace(/'http'/, 'ws'), {
    reconnectionDelay: 1000,
    transports: ['websocket', 'polling'],
});
socket.connect();
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

const connectSocketEvents = socket => {

    socket.on('connect_error', error => {
        console.log(`WS is connected to ${wsUrl} error`, error);
    });

    socket.on('disconnect', reason => {
        switch(reason) {
            case 'io server disconnect':
            case 'io client disconnect':
            case 'ping timeout':
            case 'transport close':
            case 'transport error':
                console.log(`WS Disconnected from ${wsUrl} for reason ${reason}`);
                break;
        }
    });
    socket.on('connect', () => {
        console.log(`WS Disconnected from ${wsUrl}`);
    });

    socket.on('welcome', data => {
        console.log(data);
    });

    for (let event in customEvents) {
        socket.on(event, customEvents[event]);
    }
}
connectSocketEvents(socket);

export default socket;
