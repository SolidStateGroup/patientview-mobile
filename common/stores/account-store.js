var BaseStore = require('./_store'),
    accountApi = require('../data/account'),
    userApi = require('../data/user'),
    _data = require('../data/_data');

var controller = {
        changePassword: function (userId, password) {
            store.saving();
            userApi.changePassword(userId, password)
                .then(() => store.saved());
        },
        failedLogin: function (data = {}) { //login endpoint failed
            store.error = data._bodyText || data._body || data.message;
            console.log(store.error);
            AjaxHandler.error(store, data);
        },
        lock: function () { //login endpoint failed
            controller.logout();
        },
        getUserInformation: function (secretWord) { //get user based on secret word
            store.loading();
            return userApi.getUserInformation({secretWord, secretWordToken: store.model.secretWordToken})
                .then(res => {
                    // console.log(JSON.stringify(res));
                    SecuredStorage.setSecretWord(secretWord, res.secretWordSalt)
                        .then(() => {
                            delete res.secretWordSalt;
                            res.checkSecretWord = true;
                            SecuredStorage.setItem("user", res)
                        })
                        .then(() => controller.setUser(res));
                })
                .catch(_.partial(AjaxHandler.error, store));
        },
        setUser: function (data) { //set model to the current user, update secret challenge with new salt
            store.model = data;

            if (AccountStore.getUser() && AccountStore.getUser().username) {
                Utils.identify(AccountStore.getUser().username)
            }

            AsyncStorage.setItem("lastlogin", new Date().valueOf() + "")

            _data.setToken(data.token);
            store.trigger('loggedin');
        },
        loggedIn: function (data) { //login endpoint callback, set user or show secret word challenge
            store.model = data;
            if (!store.hasSecretWord()) {
                // User has no secret word set up, get user info without using secret word
                AsyncStorage.setItem("lastlogin", new Date().valueOf() + "")
                return userApi.getUserWithoutSecret(data)
                    .then(controller.setUser);
            } else {
                // User has a secret word, user will be prompted to enter it
                store.trigger('loggedin');
            }
        },
        login: function (details) {
            store.error = "";
            store.loading();
            delete store.error;
            if (details.secretWord && details.secretWord.length) {
                controller.getUserInformation(details.secretWord)
            } else {
                accountApi.login({username: details.username, password: details.password})
                    .then(res => {
                        return SecuredStorage.init(details.password)
                            .then(() => this.loggedIn(res));
                    })
                    .catch(this.failedLogin)
            }
        },
        logout: function () {
            accountApi.logout(_data.token)
                .then(() => {
                    _data.token = '';
                    AsyncStorage.removeItem("lastlogin");
                    if (store.getUserId()) {
                        API.push.unsubscribe('/topics/' + store.getUserId() + Project.topic);
                        API.push.unsubscribe('/topics/' + store.getUserId() + Project.topicMessage);
                    }
                    store.loading();
                    delete store.error;
                    delete store.token;
                    delete store.user;
                    AsyncStorage.removeItem("latestObservationDate");
                    AsyncStorage.removeItem("latestReadResult");
                    SecuredStorage.clear();
                    AsyncStorage.removeItem("user");
                    AsyncStorage.removeItem("unreadCount");
                    AsyncStorage.removeItem('biometricKeychain');
                    store.loaded();
                    store.trigger('logout');
                })
                .catch(_.partial(AjaxHandler.error, store));
        },
        saveUserPhoto(base64) {
            store.saving();
            userApi.saveUserPhoto(store.model.id, base64)
                .then(this.savedUserPhoto)
                .catch(
                    _.partial(AjaxHandler.error, store)
                )
        },
        savedUserPhoto: function () {
            store.saved();
            store.trigger('savedUserPhoto');
        },
        updateOwnSettings: function (user) {
            var toSend = Object.assign({}, store.getUserForEdit(), user);
            delete  toSend.confirmEmail;
            store.loading();
            userApi.updateOwnSettings(toSend)
                .then(this.updatedOwnSettings)
                .catch(_.partial(AjaxHandler.error, store))
        },
        checkSecretLetter: function (word) {
        },
        changeSecretWord: function (secretWord, oldSecretWord, password) {
            store.loading();
            userApi.changeSecretWord(secretWord, oldSecretWord, store.getUser().id)
                .then((newSalt) => {
                    SecuredStorage.setSecretWord(secretWord, newSalt)
                        .then(() => {
                            store.model = Object.assign({}, store.model, {checkSecretWord: true});
                            SecuredStorage.setItem("user", store.model);
                            if (password) {
                                userApi.changePassword(store.getUser().id, password)
                                    .then(() => {
                                        store.loaded();
                                        store.trigger('settings-saved');
                                    })
                            } else {
                                store.loaded();
                                store.trigger('settings-saved');
                            }
                        })


                })
                .catch(_.partial(AjaxHandler.error, store));
        },
        updatedOwnSettings: function () {
            userApi.getUser(store.getUserId())
                .then((data) => {
                    store.model.user = data;
                    controller.setUser(store.model);
                    SecuredStorage.setItem("user", store.model);
                    store.trigger('settings-saved');
                    store.loaded();
                })
                .catch(_.partial(AjaxHandler.error, store));
        }
    },
    store = _.assign({}, BaseStore, {
        id: 'account',
        token: null,
        error: null,
        model: null,
        getError: function () {
            return this.error;
        },
        getIdentifiers: function () {
            var user = store.getUser();
            return user && user.identifiers || []
        },
        setUserFromLocal: function (data) {
            AsyncStorage.setItem("lastlogin", new Date().valueOf() + "")
            store.model = data;
            if(store.getUser() && store.getUser().username)
                Utils.identify(store.getUser().username)
            _data.setToken(data.token);
        },
        getToken: function () {
            return this.token;
        },
        getEmail: function () {
            return store.getUser() && store.getUser().email || "";
        },
        getContactNumber: function () {
            return store.getUser() && store.getUser().contactNumber || "";
        },
        hasGroupFeature: function (featureName) {
            return store.model && !!_.find(store.model.user.groupRoles, groupRole => _.find(groupRole.group.groupFeatures, feature => feature.feature.name === featureName));
        },
        getUser: function () {
            return this.model && this.model.user;
        },
        shouldSetPassword: function () {
            if (Constants.simulate.SHOULD_CHANGE_PASSWORD)
                return true

            return this.getUser() && this.getUser().changePassword;

        },
        getUserForEdit: function () {
            const user = store.getUser();
            return user &&
                {
                    "id": user.id,
                    "username": user.username,
                    "forename": user.forename,
                    "surname": user.surname,
                    "dateOfBirth": user.dateOfBirth,
                    "roleDescription": user.roleDescription,
                    "email": user.email,
                    "locked": user.locked,
                    "emailVerified": user.emailVerified,
                    "dummy": user.dummy,
                    "contactNumber": user.contactNumber
                }

        },
        getUserId: function () {
            return store.getUser() && store.getUser().id;
        },
        hasSecretWord: function () {
            if (!store.model)
                return false

            return store.model && store.model.checkSecretWord;
        },
        dispatcherIndex: Dispatcher.register(this, function (payload) {
            var action = payload.action; // this is our action from handleViewAction

            switch (action.actionType) {
                case Actions.CHANGE_PASSWORD:
                    controller.changePassword(store.getUserId(), action.password);
                    break;
                case Actions.LOGIN:
                    controller.login(action.details);
                    break;
                case Actions.LOCK:
                    controller.lock();
                    break;
                case Actions.LOGOUT:
                    controller.logout();
                    break;
                case Actions.SAVE_USER_PHOTO:
                    controller.saveUserPhoto(action.base64);
                    break;
                case Actions.CHANGE_SECRET_WORD:
                    controller.changeSecretWord(action.secretWord, action.oldSecretWord, action.password);
                    break;
                case Actions.UPDATE_OWN_SETTINGS:
                    controller.updateOwnSettings(action.user);
                    break;
                default:
                    return;
            }
        })
    });

controller.store = store;
module.exports = controller.store;