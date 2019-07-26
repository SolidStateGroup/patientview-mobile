import data from "../data/_data";

var BaseStore = require('./_store'),
    api = require('../data/results');

var controller = {
        get: function (id) {
            store.loading();
            api.getResultClusters()
                .then((resultClusters) => {
                    store.model = resultClusters;
                    store.loaded();
                })
        },

    },
    store = _.assign({}, BaseStore, {
        id: 'result-clusters',
        model: {},
        dispatcherIndex: Dispatcher.register(this, function (payload) {
            var action = payload.action;
            switch (action.actionType) {
                case Actions.GET_RESULT_CLUSTERS:
                    controller.get();
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