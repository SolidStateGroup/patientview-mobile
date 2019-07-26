module.exports = function (options) {
    return React.createClass(_.assign({}, options, {
        _listeners: [],
        setTheme: function (theme) {
            window.theme = theme;
            StatusBarIOS.setStyle(getColour().iosStyle, true);

            this.forceUpdate();
        },
        listenTo: function (store, event, callback) {
            this._listeners.push({
                store: store,
                event: event,
                callback: callback
            });
            store.on(event, callback);
            return this._listeners.length;
        },

        stopListening: function (index) {
            var listener = this._listeners[index];
            listener.store.off(listener.event, listener.callback);
        },

        req: function (val) {
            return val ? 'validate valid' : 'validate invalid';
        },

        setPathState: function (path, e) {
            var newState = {};
            newState[path] = Utils.safeParseEventValue(e);
            this.setState(newState);
        },

        componentWillUnmount: function () {
            _.each(this._listeners, function (listener, index) {
                this.stopListening(index);
            }.bind(this));
            return options.componentWillUnmount ? options.componentWillUnmount() : true;
        }
    }));
};
