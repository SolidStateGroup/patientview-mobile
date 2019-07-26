var BaseStore = require('./_store'),
    api = require('../data/results');

var hasChanged = false;
var controller = {
        send: (message, conversationId)=> {
            api.sendMessage(message, conversationId, AccountStore.getUserId())
                .then((res)=> {
                    controller.get(conversationId)
                    _.defer(()=>AppActions.getMessages())
                })
        },
        get: function (id) {
            store.loading();
            if (store.interval) {
                clearInterval(store.interval)
            }
            store.interval = setInterval(()=> {
                controller.get(id)
            }, Project.messagePollingInterval || 20000)
            Promise.all([
                api.getMessage(AccountStore.getUserId(), id,()=>{
                    AppActions.getMessages();
                }),
            ]).then((res)=> {
                store.model = store.model || {};

                res[0].messages = _.groupBy(res[0].messages && res[0].messages.reverse(), (m)=> {
                    m.message = escape(m.message)
                    return moment(m.created).format("Do MMMM YYYY")
                });
                var sections = Object.keys(res[0].messages);
                res[0].messages = _.map(sections).map((section)=> {
                    return {data: res[0].messages[section], title: section}
                });
                store.model[id] = res[0];
                SecuredStorage.setItem(`messages-${id}`, store.model);
                store.loaded();
            })
        },

    },
    store = _.assign({}, BaseStore, {
        id: 'message',
        model: {},
        dispatcherIndex: Dispatcher.register(this, function (payload) {
            var action = payload.action;
            switch (action.actionType) {
                case Actions.GET_MESSAGE:
                    controller.get(action.id);
                    break;
                case Actions.GET_MESSAGES_NEXT:
                    // controller.getNext();
                    break;
                case Actions.CONNECTED:
                    // store.model && controller.get();
                    break;
                case Actions.LOGOUT:
                    store.model = null;
                    break
                case Actions.SEND_MESSAGE:
                    controller.send(action.message, action.conversationId);
                    break
                case Actions.DATA:
                    const data = action.data;
                    store.model = store.model || {}
                    _.each(data, (res, key) => {
                        if (key.indexOf('messages-') == 0) {
                            store.model[key.replace('messages-', "")] = res;
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