var BaseStore = require('./_store'),
    api = require('../data/results');

var controller = {
        getGroup: function () {
            return _.map(_.groupBy(store.model, (i) => {
                return moment(i.created).format(store.groupFormat)
            }), (data, title) => {
                return {
                    title, data
                }
            });
        },
        upload: function (data) {
            store.error = null;
            store.saving();
            api.upload(AccountStore.getUserId(), Object.assign({}, data, {creator: {id: AccountStore.getUserId()}}))
                .then((res) => {
                    store.model.unshift({
                        deleted: res.deleted,
                        filesize: res.filesize,
                        height: res.height,
                        id: res.id,
                        localPath: res.localPath,
                        path: res.path,
                        thumbnail: res.thumbnail,
                        type: res.type,
                        width: res.width,
                    });
                    store.grouped = controller.getGroup();
                    SecuredStorage.setItem(`media`, store.model);
                    store.total = controller.calculateTotal(store.model);
                    store.saved();
                })

        },
        delete: function (data) {
            store.error = null;
            store.isDeleting = true;
            store.saving();
            api.deleteMedia(AccountStore.getUserId(), _.map(data, "id"))
                .then((res) => {
                    return controller.getMedia()
                        .then(() => {
                            store.isDeleting = false;
                            store.saved();
                        })
                }).catch(_.partial(AjaxHandler.error, store))

        },
        share: function (media, message) {
            store.isSharing = true;
            store.saving();


            api.shareMedia(AccountStore.getUserId(), _.map(media, "id"), message.id)
                .then((res) => {
                    store.isSharing = false;
                    store.saved();
                })
                .catch(_.partial(AjaxHandler.error, store))
        },
        calculateTotal: function (mediaItems) {
            let bytes = 0
            _.each(mediaItems, (f) => {
                bytes += f.filesize;
            });
            return Format.formatBytes(bytes, 1)
        },
        getMedia: function (clearError = true) {
            var userId = AccountStore.getUserId() + "";
            store.loading();
            return api.getMedia(AccountStore.getUserId())
                .then((res) => {
                    if (userId != AccountStore.getUserId() + "")
                        return
                    store.model = res && res.content && res.content.map((c) => {
                        return {
                            deleted: c.deleted,
                            filesize: c.filesize,
                            height: c.height,
                            id: c.id,
                            localPath: c.localPath,
                            path: c.path,
                            thumbnail: c.thumbnail,
                            type: c.type,
                            width: c.width,
                        }
                    });
                    store.grouped = controller.getGroup();
                    store.total = controller.calculateTotal(store.model);
                    SecuredStorage.setItem(`media`, store.model);
                    if (clearError)
                        store.error = null;
                    store.loaded();
                }).catch(_.partial(AjaxHandler.error, store))

            // api.getMedia(AccountStore.getUserId())
            //     .then((media)=> {
            //         store.model = media;
            //         SecuredStorage.setItem("media", store.model);
            //         store.changed();
            //     })
        },

    },
    store = _.assign({}, BaseStore, {
        id: 'media',
        groupFormat: "MMMM YYYY",
        dispatcherIndex: Dispatcher.register(this, function (payload) {
            var action = payload.action; // this is our action from handleViewAction
            const userId = AccountStore.getUserId();

            switch (action.actionType) {

                case Actions.GET_MEDIA:
                    controller.getMedia();
                    break;
                case Actions.UPLOAD_MEDIA:
                    controller.upload(action.data);
                    break;
                case Actions.CONNECTED:
                    if (userId) controller.getMedia();
                    break;
                case Actions.DELETE_MEDIA:
                    controller.delete(action.selection)
                    break;
                case Actions.SHARE_MEDIA:
                    controller.share(action.media, action.message)
                    break;
                case Actions.LOGOUT:
                    store.model = null;
                    store.grouped = null;
                    store.total = null;
                    break;
                case Actions.DATA:
                    const data = action.data;
                    store.model = data.media;
                    store.grouped = controller.getGroup();
                    store.total = controller.calculateTotal(store.model);
                    break;
                case Actions.ACTIVE: {
                    if (action.sessionLength > 5000 && userId) {
                        controller.getMedia(false);
                    }
                    break
                }
                default:
                    return;
            }
        }),
        calculateTotal: function (selection) {
            return controller.calculateTotal(selection)
        }
    });

controller.store = store;
module.exports = controller.store;