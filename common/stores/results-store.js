var BaseStore = require('./_store'),
    api = require('../data/results');

var controller = {

        getResultsSummary: function (userId) {
            if (!userId) return
            store.loading();
            Promise.all([
                api.getResultsSummary(userId),
            ])
                .then(this.loadedResultsSummary)
                .catch(_.partial(AjaxHandler.error, store))
            controller.getUnreadCount()
        },

        getUnreadCount: function () {
            if (store.interval) {
                clearInterval(store.interval)
            }
            store.interval = setInterval(()=> {
                controller.getUnreadCount();
            }, Project.messagePollingInterval || 20000);

            api.getUnreadCount(AccountStore.getUserId())
                .then((unreadCount)=> {
                    store.unreadCount = unreadCount;
                    AsyncStorage.setItem("unreadcount", unreadCount + "")
                    store.changed();
                })
        },

        loadedResultsSummary: function (res) {

            var allPanels = [];
            var latestObservationDate = 0;
            var latestObservation = null;
            var data = res[0];
            AsyncStorage.getItem("latestReadResult", (err, res) => {
                if (res && !Constants.simulate.NOT_READ_RESULTS) {
                    store.latestReadResult = parseInt(res);
                } else {
                    store.latestReadResult = 0;
                }
                _.each(data, (groupData) => {

                    let latestObservationDate = 0;
                    //Every group, sort by panel, panelOrder, latestObservation date
                    var sortedPanels = _.sortBy(_.flatMap(groupData.panels), (panelItem) => {
                        if (!panelItem.latestObservation) {// if there's no observation, deprioritise the panel
                            return 999999;
                        }
                        if (latestObservationDate < panelItem.latestObservation.applies) {
                            latestObservationDate = panelItem.latestObservation.applies;
                        }
                        // panel number, panel order
                        return (panelItem.panel * 100) + panelItem.panelOrder - panelItem.latestObservation.applies;
                    });

                    const latestDate = moment(latestObservationDate)
                        .format("DDMMYYYY");


                    _.each(sortedPanels, (panel) => {
                        //Every panel
                        var panelResultDate = panel.latestObservation && panel.latestObservation.applies
                        panel.group = groupData.group;
                        panel.search = panel.heading.toLowerCase() + " " + panel.name.toLowerCase() + " " // cache a value used for search
                        allPanels.push(panel); //add panel to all results

                        if (panelResultDate && panelResultDate > latestObservationDate) { //store latest observation date
                            latestObservationDate = panelResultDate;
                            latestObservation = panel;
                        }

                        if (panel.latestObservation != null
                            && panel.latestObservation != undefined
                            && moment(panel.latestObservation.applies).format("DDMMYYYY") == latestDate) {
                            panel.isLatest = true;
                        }

                    });

                });

                store.resultsSummary = {allPanels, latestObservationDate, latestObservation};
                // SecuredStorage.setItem("resultsSummary", store.resultsSummary);

                ///compare sync dates of panels, only update out of date results
                AsyncStorage.getItem("latestObservationDate", (err, res) => {
                    const newLatest = latestObservationDate + ""

                    if (newLatest != res) { // if the latest observation date is different , sync all results
                        AsyncStorage.setItem("latestObservationDate", newLatest);
                    }
                    var i = 0;


                    _.each(store.getResultPanels(), (panel) => {
                        AsyncStorage.getItem(panel.code, (err, res) => {
                            let shouldUpdate = true;
                            if (res) {
                                if (parseInt(res) >= latestObservationDate) {
                                    shouldUpdate = false;
                                }
                            }

                            if (shouldUpdate) {
                                setTimeout(() => { //Sync results in a staggered fashion to prevent any CPU load
                                    AppActions.getResults(panel.code);
                                }, i++ * 500);
                            }
                        });
                    });
                    SecuredStorage.setItem(`resultsSummary`, store.resultsSummary);

                    store.changed();


                });

                store.loaded();
            });

        }
    },
    store = _.assign({}, BaseStore, {
        id: 'results',
        resultsSummary: null,
        availableObservationHeadings: null,
        getUnreadCount: function () {
            return store.unreadCount;
        },
        findMatchingHeading: function (heading) {
            if (heading.code == "bpsys") {
                return _.find(this.resultsSummary.allPanels,{code:"bpdia"});
            } else if (heading.code == "bpdia") {
                return _.find(this.resultsSummary.allPanels,{code:"bpsys"});
            }
            return null;
        },
        hasNewResults: function () {
            var latestRead = store.latestReadResult;
            if (!latestRead) {
                return true
            }
            return store.getResultsSummary() && store.getResultsSummary().latestObservationDate > latestRead;
        },
        getResults: function () {
            return this.results;
        },
        getResultsSummary: function () {
            return this.resultsSummary;
        },
        getResultPanels: function (search, sort) {
            var results = this.resultsSummary && this.resultsSummary.allPanels;
            if (search) {
                search = search.toLowerCase();
                results = results && _.filter(results, (r)=> {
                        return r.search.indexOf(search) != -1
                    })
            }
            if (sort != "RECENT") {
                switch (sort) {
                    case "REVERSE_ALPHABETICALLY":
                        return _.sortBy(results, (r)=>r.search).reverse();
                    default:
                        return _.sortBy(results, (r)=>r.search)
                }
            }
            return results;
        },
        dispatcherIndex: Dispatcher.register(this, function (payload) {
            var action = payload.action; // this is our action from handleViewAction

            switch (action.actionType) {

                case Actions.GET_RESULTS_SUMMARY:
                    controller.getResultsSummary(AccountStore.getUserId());
                    break;
                case Actions.CONNECTED:
                    AccountStore.getUserId() && controller.getResultsSummary(AccountStore.getUserId());
                    break;
                case Actions.DATA:
                    const data = action.data;
                    if (data.resultsSummary) {
                        AsyncStorage.getItem("latestReadResult", (err, res) => {
                            if (res && !Constants.simulate.NOT_READ_RESULTS) {
                                store.latestReadResult = parseInt(res);
                            }
                            store.resultsSummary = data.resultsSummary;
                        });
                    }
                    break;
                case Actions.ACTIVE: {
                    if (action.sessionLength > 5000) {
                        controller.getResultsSummary(AccountStore.getUserId());
                    }
                    break
                }
                case Actions.GET_UNREAD_COUNT: {
                    controller.getUnreadCount();
                    break;
                }
                case Actions.LOGOUT: {
                    store.latestReadResult = null;
                }
                case Actions.SET_LAST_READ_RESULTS:
                    if (!store.resultsSummary)
                        return;
                    if (store.latestReadResult != store.resultsSummary.latestObservationDate) {
                        store.latestReadResult = store.resultsSummary.latestObservationDate;
                        store.changed();
                        AsyncStorage.setItem("latestReadResult", store.latestReadResult + "");
                    }
                    break;
                default:
                    return;
            }
        })
    });


AsyncStorage.getItem("unreadcount", (err, res)=> {
    if (res)
        store.unreadCount = parseInt(res);
})

controller.store = store;
module.exports = controller.store;