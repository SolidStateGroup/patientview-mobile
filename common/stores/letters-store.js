var BaseStore = require('./_store'),
    api = require('../data/results');

var hasChanged = false;
var controller = {
        get: function () {
            store.loading();
            Promise.all([
                api.getLetters(AccountStore.getUserId())
            ]).then((res)=> {
                var re = /[^\040-\176\200-\377]/gi;

                store.model = res[0].map((res)=> {
                    return Object.assign(res, {
                        id: Utils.GUID(),
                        groupName: res.group.name,
                        content: (res.content||"").replace(/[\n\r]/g, "<BR/>").replace(re, '')
                    })
                });
                SecuredStorage.setItem(`letters`, store.model);
                store.loaded();
            })
        }
    },
    store = _.assign({}, BaseStore, {
        id: 'results',

        getResults: function () {
            return this.model
        },

        dispatcherIndex: Dispatcher.register(this, function (payload) {
            var action = payload.action;
            switch (action.actionType) {
                case Actions.GET_LETTERS:
                    controller.get();
                    break;
                case Actions.CONNECTED:
                    store.model && controller.get();
                    break;
                case Actions.LOGOUT:
                    store.model = null;
                    break
                case Actions.DATA:
                    store.model = action.data["letters"];
                    break;
                default:
                    return;
            }
        })
    });

controller.store = store;
module.exports = controller.store;