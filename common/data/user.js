var data = require('./_data');

module.exports = {
    changePassword: function (id, password) {
        return data.post(Project.api + 'user/' + id + '/changePassword', { password: password });
    },
    get: function (params) {
        //console.log(params);
        //return data.get(Project.api + 'user?' + 'groupIds[]=0&roleIds[]=1&size=10&sortDirection=ASC&sortField=username');
        //return data.get(Project.api + 'user?' + $.param(params, true));
        return data.get(Project.api + 'user?groupIds=0&roleIds=1&size=10&sortDirection=ASC&sortField=username');
        //?groupIds=0&page=0&roleIds=1&searchEmail=&searchForename=&searchIdentifier=&searchSurname=&searchUsername=&size=10&sortDirection=ASC&sortField=surname');
    },
    getUser: function (id) {
        return data.get(Project.api + 'user/' + id);
    },
    getUserWithoutSecret: function(obj) {
        return data.post(Project.api + 'auth/userinformation', obj);
    },
    getUserInformation: function (obj) {
        return data.post(Project.api + 'auth/userinformation', obj);
    },
    saveUserPhoto: function (id, base64) {
        return data.post(Project.api + 'user/' + id + '/picturebase64', base64);
    },
    updateOwnSettings: function (user) {
        return data.put(Project.api + 'user/' + user.id + '/settings', user);
    },
    changeSecretWord: function (word,oldWord,userId) {
        word = word.toUpperCase();
        oldWord = oldWord.toUpperCase();
        return data.post(Project.api + 'user/' + userId + '/changeSecretWord?salt=true', { secretWord1: word, secretWord2: word, oldSecretWord: oldWord });
    }
};