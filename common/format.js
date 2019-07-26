var sanitizeHtml = require('insane');

module.exports = {

    enumeration: {
        get: function (value) { // MY_CONSTANT > My constant
            if (!value) {
                return "";
            }
            return Format.camelCase(value.replace('_', " "));
        },
        set: function (value) { //My Constant > MY_CONSTANT
            return value.replace(' ', "_").toUpperCase();
        }
    },

    fileExtension: function (filename) {
        return filename ? filename.split('.').pop() : "";
    },

    monthAndYear: function (value) { //DATE > Jan 2015
        if (value) {
            var m = moment(value);
            return m.isValid() ? m.format("MMM YYYY") : "Invalid date"
        }
    },

    time: function (value) { //DATE > 10:00pm
        if (value) {
            var m = moment(value);
            return m.isValid() ? m.format("h:mm a") : "Invalid date"
        }
    },


    duration(time) {
        // Hours, minutes and seconds
        var hrs = parseInt(~~(time / 3600));
        var mins = parseInt(~~((time % 3600) / 60));
        var secs = parseInt(time % 60);

        // Output like "1:01" or "4:03:59" or "123:03:59"
        var ret = "";

        if (hrs > 0) {
            ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }

        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
    },

    formatBytes: function (bytes, decimals) {
        if (bytes == 0) return '0 Bytes';
        var k = 1000 ,
            dm = decimals || 2,
            sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },

    cleanHTML: function (val) {
        return sanitizeHtml(val, {
            'allowedTags': ['strong', 'a', 'b', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'br']
        })
    },

    money: function (value) {
        if (value == 0) {
            return "FREE";
        }
        return value && '£' + ((value).toFixed(2).replace(/./g, function (c, i, a) {
            return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
        }));
    },

    startAndEnd: function (event) {
        return moment(event.start).format("hh:mma") + " - " + moment(event.end).format("hh:mma")
    },

    age: function (value) { //DATE > 10
        if (value) {
            var a = moment(),
                b = moment(value);
            return a.diff(b, 'years');
        }
    },

    nearestTen: function (value) { //11 > 10
        return value >= 10 ? value : '0' + value;
    },

    countdown: function (value) { //DATE > NOW || 10d1h10m
        var duration;
        if (value) {
            if (Utils.isInPast(value)) {
                return 'Now';
            }
            duration = moment.duration({to: moment(value), from: moment()});
            return Format.nearestTen(parseInt(duration.asDays())) + 'd ' + Format.nearestTen(duration.hours()) + 'h '
                + Format.nearestTen(duration.minutes()) + 'm';
        }
    },

    countdownMinutes: function (value) { //DATE > 10:05
        var duration;
        if (value) {
            duration = moment.duration({to: moment(value), from: moment()});
            return Format.nearestTen(parseInt(duration.minutes())) + ':' + Format.nearestTen(duration.seconds());
        }
    },

    dateAndTime: function (value) {
        if (value) {
            var m = moment(value);
            return m.isValid() ? m.format("MMMM Do YYYY, h:mm a") : "Invalid date"
        }
    },

    date: function (value) {
        if (value) {
            var m = moment(value);
            return m.isValid() ? m.format("MM/YYYY") : "Invalid date"
        }
    },

    ago: function (value) { //DATE > 5 minutes ago (see moment docs)
        if (value) {
            var m = moment(value);
            return m.fromNow();
        }
    },

    dateToInt: function (value) { //DATE > 1449345412565 (
        return value ? moment(value).valueOf() : -1
    },

    moment: function (value, format) { //DATE, hh:mm > 23:00
        if (value) {
            var m = moment(value);
            return m.format(format);
        }
    },

    minutes: function (value) {
        if (value) {
            var m = moment(value);
            return m.format('HH:mm');
        }
        return '';
    },

    camelCase: function (val) { //hello world > Hello world
        return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
    },

    fullName: function (person) { //{firstName:'Kyle', lastName:'Johnson'} > Kyle Johnson
        if (!person) {
            return '';
        }
        var fn = person.firstName || '',
            sn = person.lastName || '';

        return fn ? Format.camelCase(fn) + ' ' + Format.camelCase(sn) : Format.camelCase(sn);
    },

    initialAndLastName: function (person) { //{firstName:'Kyle', lastName:'Johnson'} > K. Johnson
        var value = Format.fullName(person),
            words;

        if (!value) {
            return;
        }
        words = value.split(' ');

        if (words.length > 1) {
            return words[0].charAt(0).toUpperCase() + '.' + ' ' + words[words.length - 1];
        }

        return value;
    },

    cssImage: function (value) { //lol.jpg  > url('lol.jpg')
        return value ? 'url("' + value + '")' : 'none';
    },

    firstCharsInArray: function (array) { //['Alpha','Beta'] > AB
        return _.map(array, function (item) {
            return item.charAt(0);
        });
    },

    ordinal: function (value) {
        var s = ["th", "st", "nd", "rd"],
            v = value % 100;
        return value ? value + (s[(v - 20) % 10] || s[v] || s[0]) : '';
    },

    truncateText: function (text, numberOfChars) { //lol,1 > l...
        if (text) {
            if (text.length > numberOfChars) {
                return text.substring(0, numberOfChars) + '...';
            }
        }
        return text;

    },

    removeAccents: function (str) { //Sergio Agüero > Sergio Aguero
        if (!str) {
            return str;
        }

        for (var i = 0; i < Utils.accents.length; i++) {
            str = str.replace(Utils.accents[i].letters, Utils.accents[i].base);
        }

        return str;

    },
};