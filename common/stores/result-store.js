var BaseStore = require('./_store'),
    api = require('../data/results');

var hasChanged = false;
var controller = {
        getResults: function (code) {
            store.loading();
            store.code = code;
            api.getResults(AccountStore.getUserId(), code)
                .then((res) => this.loadedResults(res, code))
                .catch(_.partial(AjaxHandler.error, store))
        },
        loadedResults: function (data, code) {
            data.lastUpdated = new Date().valueOf();
            AsyncStorage.getItem("latestObservationDate", (err, res) => {
                AsyncStorage.setItem(code, res);
            });

            //filter out invalid results
            let valueNum = null;
            store.results[code] = _.filter(JSON.parse(data)
                    .map((result) => {
                        return {
                            groupName: result.group && result.group.name,
                            value: result.value,
                            valueNum: parseFloat(result.value),
                            applies: result.applies
                        }
                    }),
                (res) => {
                    return res.applies > -2208988800000
                });

            store.results[code] = _.sortBy(store.results[code], (r) => r.applies)

            _.each(store.results[code], (result, i) => {
                var newValueNum = parseFloat(result.value)
                var change = 0;
                if (valueNum != null) {
                    change = newValueNum - valueNum;
                }
                valueNum = newValueNum;
                store.results[code][i] = Object.assign(result, {change})
            });

            SecuredStorage.setItem(`result-${code}`, store.results[code]);
            store.loaded();
        },
    },
    store = _.assign({}, BaseStore, {
        id: 'result',
        userId: null,
        results: {},
        getResults: function (code) {
            return this.results[code];
        },
        dispatcherIndex: Dispatcher.register(this, function (payload) {
            var action = payload.action;
            switch (action.actionType) {
                case Actions.GET_RESULTS:
                    controller.getResults(action.code);
                    break;
                case Actions.CONNECTED:
                    store.code && controller.getResults(store.code);
                    break;
                case Actions.LOGOUT:
                    _.each(store.results, (val, code) => { // clear last updated
                        AsyncStorage.setItem(code, "");
                    });
                    store.model = {};
                    break
                case Actions.DATA:
                    const data = action.data;
                    _.each(data, (res, key) => {
                        if (key.indexOf('result-') == 0) {
                            store.results[key.replace('result-', "")] = res;
                        }
                    });
                    break;
                default:
                    return;
            }
        })
    });

controller.store = store;
module.exports = controller.store;