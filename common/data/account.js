var data = require('./_data');

module.exports = {
    login: function (details) {
        return data.post(Project.api + 'auth/loginmobile', details);
    }
};