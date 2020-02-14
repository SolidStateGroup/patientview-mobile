import data from "../data/_data";

module.exports = {
    changePassword: function (password) {
        Dispatcher.handleViewAction({
            actionType: Actions.CHANGE_PASSWORD,
            password
        })
    },
    active: function (sessionLength) {
        Dispatcher.handleViewAction({
            actionType: Actions.ACTIVE,
            sessionLength
        })
    },
    inactive: function () {
        Dispatcher.handleViewAction({
            actionType: Actions.INACTIVE
        })
    },
    getResults: function (code) {
        Dispatcher.handleViewAction({
            actionType: Actions.GET_RESULTS,
            code
        })
    },
    getStats: function () {
        Dispatcher.handleViewAction({
            actionType: Actions.GET_STATS,
        })
    },
    getResultsSummary: function () {
        Dispatcher.handleViewAction({
            actionType: Actions.GET_RESULTS_SUMMARY
        })
    },
    getAlertInfo: function () {
        Dispatcher.handleViewAction({
            actionType: Actions.GET_ALERT_INFO
        })
    },
    connected: function () {
        Dispatcher.handleViewAction({
            actionType: Actions.CONNECTED
        })
    },
    disconnected: function () {
        Dispatcher.handleViewAction({
            actionType: Actions.DISCONNECTED
        })
    },
    setLestReadResults: function () {
        Dispatcher.handleViewAction({
            actionType: Actions.SET_LAST_READ_RESULTS
        })
    },

    getResultClusters:function() {
        Dispatcher.handleViewAction({
            actionType: Actions.GET_RESULT_CLUSTERS
        });
    },

    getEditResults:function() {
        Dispatcher.handleViewAction({
            actionType: Actions.GET_EDIT_RESULTS
        });
    },

    removeResult:function(result) {
        Dispatcher.handleViewAction({
            actionType: Actions.REMOVE_RESULT,
            result
        });
    },

    editResult:function(result) {
        Dispatcher.handleViewAction({
            actionType: Actions.EDIT_RESULT,
            result
        });
    },

    login: function (details) {
        Dispatcher.handleViewAction({
            actionType: Actions.LOGIN,
            details
        })
    },
    lock: function () {
        Dispatcher.handleViewAction({
            actionType: Actions.LOCK
        })
    },
    logout: function () {
        Dispatcher.handleViewAction({
            actionType: Actions.LOGOUT
        })
    },

    changeSecretWord: function (secretWord, oldSecretWord, password) {
        Dispatcher.handleViewAction({
            actionType: Actions.CHANGE_SECRET_WORD,
            secretWord,
            oldSecretWord,
            password,
        })
    },
    setAlertInfo: function (code, id, value) {
        Dispatcher.handleViewAction({
            actionType: Actions.SET_ALERT_INFO,
            code,
            id,
            value,
        })
    },
    saveUserPhoto: function (base64) {
        Dispatcher.handleViewAction({
            actionType: Actions.SAVE_USER_PHOTO,
            base64
        })
    },
    updateSettings: function (user) {
        Dispatcher.handleViewAction({
            actionType: Actions.UPDATE_OWN_SETTINGS,
            user
        })
    },
    data: function (data) {
        Dispatcher.handleViewAction({
            actionType: Actions.DATA,
            data
        })
    },
    getLetters: function () {
        Dispatcher.handleViewAction({
            actionType: Actions.GET_LETTERS,
        })
    },
    getConditions: function () {
        Dispatcher.handleViewAction({
            actionType: Actions.GET_CONDITIONS,
        })
    },
    getConversations: function () {
        Dispatcher.handleViewAction({
            actionType: Actions.GET_CONVERSATIONS,
        })
    },
    getMedicines: function () {
        Dispatcher.handleViewAction({
            actionType: Actions.GET_MEDICINES,
        })
    },
    getMessages: function () {
        Dispatcher.handleViewAction({
            actionType: Actions.GET_MESSAGES,
        })
    },
    getMessage: function (id) {
        Dispatcher.handleViewAction({
            actionType: Actions.GET_MESSAGE,
            id
        })
    },
    getNextMessagesPage: function () {
        Dispatcher.handleViewAction({
            actionType: Actions.GET_MESSAGES_NEXT,
        })
    },
    toggleOptIn: function () {
        Dispatcher.handleViewAction({
            actionType: Actions.TOGGLE_OPT_IN,
        })
    },

    sendMessage: function (message, conversationId) {
        Dispatcher.handleViewAction({
            actionType: Actions.SEND_MESSAGE,
            message, conversationId,
        });
    },
    getUnreadCount: function () {
        Dispatcher.handleViewAction({
            actionType: Actions.GET_UNREAD_COUNT,
        });
    },
    uploadMedia: function (data) {
        Dispatcher.handleViewAction({
            actionType: Actions.UPLOAD_MEDIA,
            data
        });
    },
    deleteMedia: function (selection) {
        Dispatcher.handleViewAction({
            actionType: Actions.DELETE_MEDIA,
            selection
        });
    },
    getMedia: function () {
        Dispatcher.handleViewAction({
            actionType: Actions.GET_MEDIA,
        });
    },
    shareMedia: function (media,message) {
        Dispatcher.handleViewAction({
            actionType: Actions.SHARE_MEDIA,
            media,
            message
        });
    },
    getINSDiaryRecordings: function () {
        Dispatcher.handleViewAction({
            actionType: Actions.GET_INS_DIARY_RECORDINGS,
        });
    },
    getMoreINSDiaryRecordings: function () {
        Dispatcher.handleViewAction({
            actionType: Actions.GET_MORE_INS_DIARY_RECORDINGS,
        });
    },
    saveINSDiaryRecording: function (recording) {
        Dispatcher.handleViewAction({
            actionType: Actions.SAVE_INS_DIARY_RECORDING,
            recording,
        });
    },
    updateINSDiaryRecording: function (id, recording) {
        Dispatcher.handleViewAction({
            actionType: Actions.UPDATE_INS_DIARY_RECORDING,
            id,
            recording,
        });
    },
    deleteINSDiaryRecording: function(id) {
        Dispatcher.handleViewAction({
            actionType: Actions.DELETE_INS_DIARY_RECORDING,
            id,
        });
    },
    getINSHospitalisations: function () {
        Dispatcher.handleViewAction({
            actionType: Actions.GET_INS_HOSPITALISATIONS,
        });
    },
    saveINSHospitalisation: function (hospitalisation) {
        Dispatcher.handleViewAction({
            actionType: Actions.SAVE_INS_HOSPITALISATION,
            hospitalisation,
        });
    },
    updateINSHospitalisation: function (id, hospitalisation) {
        Dispatcher.handleViewAction({
            actionType: Actions.UPDATE_INS_HOSPITALISATION,
            id,
            hospitalisation,
        });
    },
    deleteINSHospitalisation: function(id) {
        Dispatcher.handleViewAction({
            actionType: Actions.DELETE_INS_HOSPITALISATION,
            id,
        });
    },
    getINSImmunisations: function () {
        Dispatcher.handleViewAction({
            actionType: Actions.GET_INS_IMMUNISATIONS,
        });
    },
    saveINSImmunisation: function (immunisation) {
        Dispatcher.handleViewAction({
            actionType: Actions.SAVE_INS_IMMUNISATION,
            immunisation,
        });
    },
    updateINSImmunisation: function (id, immunisation) {
        Dispatcher.handleViewAction({
            actionType: Actions.UPDATE_INS_IMMUNISATION,
            id,
            immunisation,
        });
    },
    deleteINSImmunisation: function(id) {
        Dispatcher.handleViewAction({
            actionType: Actions.DELETE_INS_IMMUNISATION,
            id,
        });
    },
};


//  removeItem: function(id) {
// Dispatcher.handleViewAction({
//     actionType: Actions.REMOVE_ITEM,
//     id
// })
// },
// getTodoItems: function() {
//     Dispatcher.handleViewAction({
//         actionType: Actions.GET_TODO_ITEMS
//     })
// },
// getUser: function(id) {
//     Dispatcher.handleViewAction({
//         actionType: Actions.GET_USER,
//         id
//     })
// },
// getUsers: function(params) {
//     Dispatcher.handleViewAction({
//         actionType: Actions.GET_USERS,
//         params
//     })
// },
// getUserInformation: function(token) {
//     Dispatcher.handleViewAction({
//         actionType: Actions.GET_USER_INFORMATION,
//         token
//     })
// },
// saveObservationHeadingSelection: function(codes, page) {
//     Dispatcher.handleViewAction({
//         actionType: Actions.SAVE_OBSERVATION_HEADING_SELECTION,
//         codes,
//         page
//     })
// },
// getAvailableObservationHeadings: function() {
//     Dispatcher.handleViewAction({
//         actionType: Actions.GET_AVAILABLE_OBSERVATION_HEADINGS
//     })
// },
// getSavedObservationHeadings: function(page) {
//     Dispatcher.handleViewAction({
//         actionType: Actions.GET_SAVED_OBSERVATION_HEADINGS,
//         page
//     })
// },