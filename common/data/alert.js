var data = require('./_data');

module.exports = {

    get: function(id) {
        return data.get(Project.api + 'user/' + id + '/alerts/RESULT');
    },
    create: function (id, alert) {
        return data.post(Project.api + 'user/' + id + '/alert', alert);
    },
    update: function (id, alert) {
        return data.put(Project.api + 'user/' + id + '/alert', alert);
    },
    delete: function (id, alert) {
        return data.delete(Project.api + 'user/' + id + '/alerts/'+alert.id);
    }
};