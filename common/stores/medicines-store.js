var BaseStore = require('./_store'),
    api = require('../data/results');

var hasChanged = false;
var controller = {
        get: function () {
            store.loading();
            Promise.all([
                api.getMedicineStatus(AccountStore.getUserId()),
                api.getMedicines(AccountStore.getUserId()),
            ]).then((res)=> {
                var unit = [],
                    gp = [];
                //Group medicines by unit/gp
                _.each(res[1], (medicine)=> {
                    medicine.id = Utils.GUID();
                    if (medicine.group && medicine.group.code == "ECS") {
                        gp.push(medicine)
                    } else {
                        unit.push(medicine)
                    }
                })
                store.model = {status: res[0], results: unit, gpResults: gp};
                SecuredStorage.setItem(`medicines`, store.model);
                store.loaded();
            })
        },

        toggleOptIn: function () {
            //opt in / out of gp medicine results
            store.loading()
            api.setMedicineStatus(AccountStore.getUserId(), Object.assign({}, store.model.status, {optInStatus: !store.model.status.optInStatus}))
                .then(()=> {
                    return api.getMedicineStatus(AccountStore.getUserId())
                })
                .then((status)=> {
                    store.model.status = status;
                    SecuredStorage.setItem(`medicines`, store.model);
                    store.loaded();
                })

        }
    },
    store = _.assign({}, BaseStore, {
        id: 'medicines',
        canOptIn: function () {
            return this.model && this.model.status && this.model.status.available;
        },
        isOptedIn: function () {
            return this.model && this.model.status && this.model.status.optInStatus;
        },
        getResults: function () {
            return this.model && this.model.results;
        },
        getGPResults: function () {
            return this.model && this.model.gpResults;
        },
        dispatcherIndex: Dispatcher.register(this, function (payload) {
            var action = payload.action;
            switch (action.actionType) {
                case Actions.GET_MEDICINES:
                    controller.get(action.code);
                    break;
                case Actions.TOGGLE_OPT_IN:
                    controller.toggleOptIn();
                    break;
                case Actions.CONNECTED:
                    store.model && controller.get();
                    break;
                case Actions.LOGOUT:
                    store.model = null;
                    break
                case Actions.DATA:
                    store.model = action.data["medicines"];
                    break;
                default:
                    return;
            }
        })
    });

controller.store = store;
module.exports = controller.store;