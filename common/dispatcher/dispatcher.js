import _ from 'lodash';

var ReactDispatcher = require('flux-react-dispatcher');
var Dispatcher = new ReactDispatcher();

module.exports = _.assign(Dispatcher, {
    handleViewAction: function (action) {

        //console.log('Action', action.actionType);
        var payload = {
            source: 'VIEW_ACTION',
            action: action
        };

        this.dispatch(payload);
    }

});
