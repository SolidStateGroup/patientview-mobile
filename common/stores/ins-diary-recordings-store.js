var BaseStore = require('./_store');
const data = require('../data/_data.js');

var controller = {
        get: function (page) {
            store.loading();
            return data.get(Project.api + 'user/' + AccountStore.getUserId() + '/insdiary?size=10' + (page ? `&page=${page}` : ''))
                .then((res)=> {
                    store.model = page ? _.unionBy(res.content, store.model, 'id') : res.content;
                    store.hasMore = !res.last && (res.number + 1);
                    SecuredStorage.setItem('ins-diary-recordings', store.model);
                    store.loaded();
                })
        },
        save: function (recording) {
            store.saving();
            return data.post(`${Project.api}user/${AccountStore.getUserId()}/insdiary`, recording)
                .then((res) => {
                    store.model = store.model || [];
                    const index = _.findIndex(store.model, h => h.id === res.id);
                    if (index !== -1) {
                        store.model[index] = res;
                    } else {
                        store.model.push(res);
                    }
                    store.model = _.orderBy(store.model, recording => recording.entryDate, ['desc']);
                    SecuredStorage.setItem('ins-diary-recordings', store.model);
                    store.saved();
                }).catch(_.partial(AjaxHandler.error, store));
        },
        update: function (id, recording) {
            store.saving();
            return data.put(`${Project.api}user/${AccountStore.getUserId()}/insdiary`, recording)
                .then((res) => {
                    const index = _.findIndex(store.model, h => h.id === id);
                    if (index !== -1) {
                        store.model[index] = res;
                    }
                    SecuredStorage.setItem('ins-diary-recordings', store.model);
                    store.saved();
                }).catch(_.partial(AjaxHandler.error, store));
        },
        delete: function (id) {
            store.saving();
            return data.delete(`${Project.api}user/${AccountStore.getUserId()}/insdiary/${id}`)
                .then((res) => {
                    const index = _.findIndex(store.model, h => h.id === id);
                    if (index !== -1) {
                        store.model.splice(index, 1);
                    }
                    SecuredStorage.setItem('ins-diary-recordings', store.model);
                    store.saved();
                }).catch(_.partial(AjaxHandler.error, store));
        },
    },
    store = _.assign({}, BaseStore, {
        id: 'ins-diary-recordings',

        getRecordings: function () {
            return this.model
        },

        hasMoreRecordings: function () {
            return !!store.hasMore;
        },

        getMostRecentRecording: function () {
            const mostRecent = store.model && !!store.model.length && _.orderBy(store.model, recording => recording.entryDate, ['desc'])[0];
            if (mostRecent && (!mostRecent.relapse || mostRecent.relapse.remissionDate != null)) {
                return null;
            }
            return mostRecent;
        },

        dispatcherIndex: Dispatcher.register(this, function (payload) {
            var action = payload.action;
            switch (action.actionType) {
                case Actions.GET_INS_DIARY_RECORDINGS:
                    controller.get();
                    break;
                case Actions.GET_MORE_INS_DIARY_RECORDINGS:
                    controller.get(store.hasMore);
                    break;
                case Actions.SAVE_INS_DIARY_RECORDING:
                    controller.save(action.recording);
                    break;
                case Actions.UPDATE_INS_DIARY_RECORDING:
                    controller.update(action.id, action.recording);
                    break;
                case Actions.DELETE_INS_DIARY_RECORDING:
                    controller.delete(action.id);
                    break;
                case Actions.CONNECTED:
                    store.model && controller.get();
                    break;
                case Actions.LOGOUT:
                    store.model = null;
                    break
                case Actions.DATA:
                    store.model = action.data["ins-diary-recordings"];
                    break;
                default:
                    return;
            }
        })
    });

controller.store = store;
module.exports = controller.store;