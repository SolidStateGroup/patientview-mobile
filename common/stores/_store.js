var EventEmitter = require('events').EventEmitter;

var DEFAULT_CHANGE_EVENT = "change",
    DEFAULT_LOADING_EVENT = "loading",
    DEFAULT_LOADED_EVENT = "loaded",
    DEFAULT_SAVED_EVENT = "saved",
    DEFAULT_SAVING_EVENT = "saving",
    DEFAULT_ERROR_EVENT = "problem";

var emitter = _.extend(EventEmitter.prototype, {

    isLoading: false,
    hasLoaded: false,
    isSaving: false,
    errorMessage: null,

    trigger: function (eventName, data) {
        // console.log(this.id, eventName || DEFAULT_CHANGE_EVENT, this);
        this.emit(eventName || DEFAULT_CHANGE_EVENT, data);
    },

    loading: function (callback) {
        delete this.errorMessage;
        this.hasLoaded = false;
        this.isLoading = true;
        this.trigger(DEFAULT_CHANGE_EVENT);
        this.trigger(DEFAULT_LOADING_EVENT);
    },

    saving: function (callback) {
        delete this.errorMessage;
        this.isSaving = true;
        this.trigger(DEFAULT_CHANGE_EVENT);
        this.trigger(DEFAULT_SAVING_EVENT);
    },

    loaded: function (data) {
        this.hasLoaded = true;
        this.isLoading = false;
        this.trigger(DEFAULT_LOADED_EVENT);
        this.trigger(DEFAULT_CHANGE_EVENT);
    },

    changed: function (data) {
        this.trigger(DEFAULT_CHANGE_EVENT);
    },

    saved: function (data) {
        this.isSaving = false;
        this.trigger(DEFAULT_SAVED_EVENT);
        this.trigger(DEFAULT_CHANGE_EVENT);
    },

    goneABitWest: function (data) {
        this.errorMessage = data._body;
        this.hasLoaded = true;
        this.isLoading = false;
        this.isSaving = false;
        this.trigger(DEFAULT_CHANGE_EVENT);
        this.trigger(DEFAULT_ERROR_EVENT);
    },

    on: function (eventName, callback) {
        // console.log("Event Added", this.id)
        this.addListener(eventName || DEFAULT_CHANGE_EVENT, callback)
    },

    off: function (eventName, callback) {
        // console.log("Event Removed", this.id)

        this.removeListener(eventName || DEFAULT_CHANGE_EVENT, callback)
    }

});
emitter.setMaxListeners(1000);
module.exports = emitter;