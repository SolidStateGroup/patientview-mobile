var BaseStore = require('./_store'),
    alertAPI = require('../data/alert');

var controller = {
        setAlertInfo(code, id, value) {
            store.saving();
            var promise = null;

            if (store.getAlertValue(code) == value) {
                promise = new Promise((resolve)=> {
                    resolve(store.model[code]);
                })
            } else {
                if (value) {
                    if (store.model[code]) { //alert exists, update it
                        store.model[code].mobileAlert = value;
                        promise = alertAPI.update(AccountStore.getUserId(), store.model[code]);
                    } else {
                        var create = store.getAlertForCreate(id);
                        promise = alertAPI.create(AccountStore.getUserId(), create);
                    }
                } else {
                    if (!store.model[code].webAlert && !store.model[code].emailAlert) {
                        promise = alertAPI.delete(AccountStore.getUserId(), store.model[code]);
                    } else if (store.model[code]) {
                        store.model[code].mobileAlert = value;
                        promise = alertAPI.update(AccountStore.getUserId(), store.model[code]);
                    }
                }
            }

            store.saving();
            promise.then((res) => {
                if (res) {
                    store.model[code] = res;
                }
                SecuredStorage.setItem("alerts", store.model);
                store.saved();
            })
                .catch((e)=> {
                    store.saved()
                })
        },
        getAlertInfo() {
            store.loading();
            alertAPI.get(AccountStore.getUserId())
                .then((res) => {
                    store.model = _.keyBy(res, (alert) => {
                        return alert.observationHeading.code;
                    });
                    SecuredStorage.setItem("alerts", store.model);
                    store.loaded();
                })
        }
    },
    store = _.assign({}, BaseStore, {
        id: 'alert',
        token: null,
        error: null,
        model: null,
        getAlertValue(heading) {
            return store.model && store.model[heading] && store.model[heading].mobileAlert ? true : false;
        },
        getAlertForCreate(id) {
            return Object.assign({}, {
                "user": { "id": AccountStore.getUserId(id) },
                "observationHeading": { id },
                "mobileAlert": true,
                "alertType": "RESULT"
            })
        },
        dispatcherIndex: Dispatcher.register(this, function (payload) {
            var action = payload.action; // this is our action from handleViewAction

            switch (action.actionType) {
                case Actions.GET_ALERT_INFO:
                    controller.getAlertInfo();
                    break;
                case Actions.SET_ALERT_INFO:
                    controller.setAlertInfo(action.code, action.id, action.value);
                    break;
                case Actions.DATA:
                    const data = action.data;
                    if (data.alerts) {
                        store.alerts = data.alerts;
                    }
                    break;
                default:
                    return;
            }
        })
    });

controller.store = store;
module.exports = controller.store;