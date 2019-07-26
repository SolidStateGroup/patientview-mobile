var data = require('./_data');

module.exports = {
    get: function () {
        return data.get(`${Project.api}config`);
    }
};