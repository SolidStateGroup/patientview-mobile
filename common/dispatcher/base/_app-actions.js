import _ from 'lodash';
module.exports = {
    login: function (type, token) { //Login with an unused token
        Dispatcher.handleViewAction({
            actionType: Actions.LOGIN,
            token: token,
            type: type
        });
    },
    setUser: function (type, user) { //Login with an unused token
        Dispatcher.handleViewAction({
            actionType: Actions.SET_USER,
            user
        });
    },
    logout: function () {
        Dispatcher.handleViewAction({ //Logout
            actionType: Actions.LOGOUT
        });
    },
    register: function (registration) { //register with an email and password {firstName, lastName, emailAddress1,2 + password1,2}
        Dispatcher.handleViewAction({
            actionType: Actions.REGISTER,
            registration: registration
        });
    },
    forgotPassword: function (emailAddress) { //process forgot password
        Dispatcher.handleViewAction({
            actionType: Actions.FORGOT_PASSWORD,
            emailAddress: emailAddress
        });
    },
    refresh: function () { //refresh the entire app
        Dispatcher.handleViewAction({
            actionType: Actions.REFRESH
        });
    },
    setChatName: function (name) {
        Dispatcher.handleViewAction({
            actionType: Actions.SET_CHAT_NAME,
            name
        });
    },
    report: function (data) {
        Dispatcher.handleViewAction({
            actionType: Actions.REPORT,
            data
        });
    },
    block: function (id) {
        Dispatcher.handleViewAction({
            actionType: Actions.BLOCK,
            id
        });
    }
};