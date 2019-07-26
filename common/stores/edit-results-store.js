import data from "../data/_data";

var BaseStore = require('./_store'),
    api = require('../data/results');

var controller = {
        remove: function (result) {
            store.loading();
            api.removeResult(AccountStore.getUserId(), result.logicalId)
                .then(() => {
                    controller.get()
                    _.defer(() => {
                        AppActions.getResultsSummary()
                    })
                })
                .catch(_.partial(AjaxHandler.error, store))
        },
        edit: function (result) {
            store.saving();
            api.editResult(AccountStore.getUserId(), {
                logicalId: result.logicalId,
                applies: moment(new Date(result.applies)).toISOString(),
                name: result.name,
                group: result.group,
                value: result.value,
            })
                .then(() => {
                    store.saved();
                    controller.get();
                    _.defer(() => {
                        AppActions.getResultsSummary()
                    })
                })
                .catch(_.partial(AjaxHandler.error, store))
        },
        get: function () {
            store.loading();
            api.getEditResults(AccountStore.getUserId())
                .then((results) => {
                    store.model = results;
                    store.loaded();
                })
        },

    },
    store = _.assign({}, BaseStore, {
        id: 'result-clusters',
        model: null,
        dispatcherIndex: Dispatcher.register(this, function (payload) {
            var action = payload.action;
            switch (action.actionType) {
                case Actions.GET_EDIT_RESULTS:
                    controller.get();
                    break;
                case Actions.EDIT_RESULT:
                    controller.edit(action.result);
                    break;
                case Actions.REMOVE_RESULT:
                    controller.remove(action.result);
                    break;
                case Actions.CONNECTED:
                    controller.get();
                    break;
                case Actions.LOGOUT:
                    store.model = null;
                    break;
                default:
                    return;
            }
        })
    });

controller.store = store;
module.exports = controller.store;