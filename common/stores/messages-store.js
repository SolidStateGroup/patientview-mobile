var BaseStore = require('./_store'),
    api = require('../data/results');

var hasChanged = false;
var controller = {
        get: function (page) {
            store.loading();
            Promise.all([
                api.getMessages(AccountStore.getUserId(), page),
            ]).then((res)=> {
                store.model = res[0];
                if (store.interval) {
                    clearInterval(store.interval)
                }
                store.interval = setInterval(()=>controller.get(), Project.messagePollingInterval || 20000)
                // SecuredStorage.setItem(`messages`, store.model);
                store.loaded();
            })
        },

    },
    store = _.assign({}, BaseStore, {
        id: 'messages',
        dispatcherIndex: Dispatcher.register(this, function (payload) {
            var action = payload.action;
            switch (action.actionType) {
                case Actions.GET_MESSAGES:
                    controller.get();
                    break;
                case Actions.GET_MESSAGES_NEXT:
                    controller.getNext();
                    break;
                case Actions.CONNECTED:
                    store.model && controller.get();
                    break;
                case Actions.LOGOUT:
                    store.model = null;
                    break
                case Actions.DATA:
                    store.model = action.data["messages"];
                    break;
                default:
                    return;
            }
        })
    });

controller.store = store;
module.exports = controller.store;