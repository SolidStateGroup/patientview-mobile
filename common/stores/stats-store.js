var BaseStore = require('./_store'),
    api = require('../data/results');

var controller = {

        getStats: function () {
            if (store.interval) {
                clearInterval(store.interval)
            }
            store.interval = setInterval(()=> {
                controller.getStats();
            }, Project.messagePollingInterval || 20000);

            const userId = AccountStore.getUserId();
            if (!userId) return;
            api.getStats(AccountStore.getUserId())
                .then((stats)=> {
                    store.model = stats;
                    SecuredStorage.setItem("stats", store.model);
                    store.changed();
                })
        },

    },
    store = _.assign({}, BaseStore, {
        id: 'results',
        resultsSummary: null,
        availableObservationHeadings: null,
        getUnreadMessages(){
            return store.model ? store.model.unreadMessages : ""
        },
        getLettersCount(){
            return store.model ? store.model.letters : ""
        },
        getMedicinesCount(){
            return store.model ? store.model.medicines : ""
        },
        dispatcherIndex: Dispatcher.register(this, function (payload) {
            var action = payload.action; // this is our action from handleViewAction
            const userId = AccountStore.getUserId();

            switch (action.actionType) {

                case Actions.GET_STATS:
                    controller.getStats();
                    break;
                case Actions.CONNECTED:
                    if (userId) controller.getStats();
                    break;
                case Actions.DATA:
                    const data = action.data;
                    store.model = data.stats;
                    break;
                case Actions.ACTIVE: {
                    if (action.sessionLength > 5000 && userId) {
                        controller.getStats();
                    }
                    break
                }
                case Actions.LOGOUT: {
                    if (store.interval) {
                        clearInterval(store.interval)
                    }
                    break;
                }
                default:
                    return;
            }
        })
    });

controller.store = store;
module.exports = controller.store;