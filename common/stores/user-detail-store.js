var BaseStore = require('./_store'),
    api = require('../data/user');

var controller = {
        getUser: function(id) {
            store.loading();
            api.getUser(id)
                .then(this.loaded)
                .catch(_.partial(AjaxHandler.error, store))
        },
        loaded: function(data) {
            store.model = data;
            store.loaded();
        }
    },
    store = _.assign({}, BaseStore, {
        id: 'user-detail',
        model: null,
        getUser: function() {
            return this.model;
        },
        dispatcherIndex: Dispatcher.register(function (payload) {
            var action = payload.action; // this is our action from handleViewAction

            switch (action.actionType) {
                case Actions.GET_USER:
                        controller.getUser(action.id);
                    break;
                default:
                    return;
            }
        })
    });

controller.store = store;
module.exports = controller.store;