//openWebModal(navigator,'www.google.com','Google')
//push.init.then((token)=>{})
import BottomSheet from 'react-native-bottomsheet';
import push from './push-notifications-api';

const Share = require('react-native-share');

var share = (uri, message, title, subject, excludedActivityTypes, type) => {
    Share.open({ uri, message, title, subject, excludedActivityTypes, type })
};

module.exports = {
    showOptions: (title, options, cancelButton = true, dark = false) => {
        options = options.concat([]);
        return new Promise((resolve) => {
            cancelButton && options.push("Cancel");
            BottomSheet.showBottomSheetWithOptions({
                options,
                title,
                dark,
                cancelButtonIndex: cancelButton && options.length - 1,
            }, (value) => {
                resolve(value);
            });
        })
    },
    push,
    share,
};
