var data = require('./_data');

module.exports = {
    getResultsByCodes: function (userId, observationHeadingCodes, limit, offset, orderDirection) {
        //console.log(offset);

        var codeString = '';
        observationHeadingCodes.forEach((code) => {
            codeString += '&code=' + code;
        });

        var getString = Project.api + 'user/' + userId + '/observations?limit=' + limit + '&offset='
            + offset + '&orderDirection=' + orderDirection + codeString;

        return data.get(getString);
    },
    getStats: function (userId) {
        return data.get(Project.api + 'user/' + userId + '/stats');
    },
    getResultClusters: function () {
        return data.get(Project.api + 'resultclusters');
    },
    enterResult: function (userId, result) {
        return data.post(Project.api + 'user/' + userId + '/observations/resultclusters', [result]);
    },
    upload: function (userId, media) {
        return data.post(Project.api + 'user/' + userId + '/mymedia/upload', media)
    },

    shareMedia: function (userId, ids, conversationId,message="") {
        return Promise.all(ids.map((id) => {
            return data.post(Project.api + 'conversation/' + conversationId + "/messages", {
                type: "MEDIA",
                myMedia: {id},
                message,
                user: {id: userId}
            });
        }))

    },
    deleteMedia: function (userId, ids) {
        return Promise.all(ids.map((id)=>{
            return data.delete(Project.api + 'user/' + userId + '/mymedia/'+id)
        }))
    },
    getMedia: function (userId, media) {
        return data.get(Project.api + 'user/' + userId + '/mymedia?sortDirection=DESC&sortField=created')
    },
    getEditResults: function (userId) {
        let groups = {};
        return data.get(Project.api + 'user/' + userId + '/patiententeredobservationheadings')
            .then((res) => {
                return res && Promise.all(res.map((res) => {
                    return data.get(Project.api + 'user/' + userId + '/observations/' + res.code + '/patiententered')
                        .then((results) => {
                            groups[res.heading] = results;
                        })
                }))
                    .then(() => {
                        return groups;
                    })
            })
    },
    setMedicineStatus: function (userId, json) {
        return data.post(Project.api + 'user/' + userId + '/gpmedicationstatus', json);
    },
    getMedicineStatus: function (userId) {
        return data.get(Project.api + 'user/' + userId + '/gpmedicationstatus');
    },
    editResult: function (userId, result) {
        return data.post(Project.api + 'user/' + userId + '/observations/patiententered/?adminId=-1',result);
    },
    removeResult: function (userId, id) {
        return data.delete(Project.api + 'user/' + userId + '/observations/' + id);
    },
    getMedicines: function (userId) {
        return data.get(Project.api + 'user/' + userId + '/medication');
    },
    getLetters: function (userId) {
        return data.get(Project.api + 'user/' + userId + '/letters');
    },
    getUnreadCount: function (userId) {
        return data.get(Project.api + 'user/' + userId + '/conversations/unreadcount');
    },
    getMessages: function (userId) {
        return data.get(Project.api + 'user/' + userId + '/conversations?conversationLabels=INBOX&page=0&size=9000');
    },
    getMessage: function (userId, id, cb) {
        return data.get(Project.api + '/conversation/' + id)
            .then((res) => {
                //find all messages without read receipts
                Promise.all(_.filter(res.messages, (m) => {
                    return !_.find(m.readReceipts, (r) => {
                        return r.user.id == AccountStore.getUserId()
                    });
                }).map((unreadMessage) => {
                    Utils.record("Read New Message");
                    console.log("Marking message", unreadMessage)
                    return data.post(Project.api + 'message/' + unreadMessage.id + "/readreceipt/" + userId)
                }))
                    .then(cb);
                return res;
            })
    },
    sendMessage: function (message, conversationId, userId) {
        return data.post(Project.api + '/conversation/' + conversationId + "/messages", {
            type: "MESSAGE",
            message,
            user: {id: userId}
        });
    },
    getResultsSummary: function (userId) {
        return data.get(Project.api + 'user/' + userId + '/observations/summary');
    },
    getResults: function (userId, code) {
        return data.get(Project.api + 'user/' + userId + '/observations/' + code, null, true);
    },
    getAvailableObservationHeadings(userId) {
        return data.get(Project.api + 'user/' + userId + '/availableobservationheadings');
    },
    getSavedObservationHeadings(userId) {
        return data.get(Project.api + 'user/' + userId + '/savedobservationheadings');
    },
    saveObservationHeadingSelection(userId, codes) {
        return data.post(Project.api + 'user/' + userId + '/saveobservationheadingselection', codes);
    }
};