var BaseStore = require('./_store');
import {AppState, AsyncStorage} from 'react-native';
const SESSION_KEY = "__SESSION_TIMER__";
let currentState = true;
let interval = null;
let _callback = null;

var store = Object.assign({}, BaseStore, {
    id: 'device',
    model: { isActive: true },
    getLastSession: function () {
        return store.model.lastSession;
    },
    getIsActive: function () {
        return store.model.isActive;
    }
});

const checkSession = () => {
    if (!interval) {
        interval = setInterval(() => {
            AsyncStorage.setItem(SESSION_KEY, new Date().valueOf() + "");
        }, 1000);
    }
   return  AsyncStorage.getItem(SESSION_KEY, (err, res) => {
        if (res) {
            store.model = Object.assign({}, store.model, { lastSession: new Date().valueOf() - parseInt(res) });
            store.changed();
        }
    });
};

checkSession();
//Calls back when app is in foreground with the date value of the last active session
AppState.addEventListener('change', (nextAppState) => {
    var isActive = nextAppState == 'active';
    if (currentState !== isActive) {
        currentState = isActive;
        store.model = Object.assign({}, store.model, { isActive });
        if (isActive) { //App is now active, callback with how long ago the last session was
            checkSession()
                .then(()=>{
                    AppActions.active(store.model.lastSession);
                })
        } else {//App is inactive, stop recording session
            interval && clearInterval(interval);
            interval = null;
            store.changed();
            AppActions.inactive();
        }
    }
});

module.exports = store;
