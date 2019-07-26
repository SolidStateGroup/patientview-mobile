var BaseStore = require('./_store');
import {NetInfo} from 'react-native';


var store = Object.assign({}, BaseStore, {
    id: 'network',
    isConnected: true,
});

var handleIsConnected = (isConnected) => {
    if (isConnected != store.isConnected) {
        store.isConnected = isConnected;
        store.changed();
        if (isConnected) {
            AppActions.connected(isConnected);
        } else {
            AppActions.disconnected(isConnected);
        }
    }
};

module.exports = store;


NetInfo.isConnected.fetch().then(handleIsConnected);
NetInfo.isConnected.addEventListener(
    'change',
    handleIsConnected
);
