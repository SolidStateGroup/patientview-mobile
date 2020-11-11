//The main entry point into the app, launches app at LoginPage
import {Navigation, NativeEventsReceiver} from 'react-native-navigation';

require('./globals/_window'); //Assign globals+libs
require('./routes'); //Register routes

import ION from 'react-native-vector-icons/Ionicons';
import styleVariables from './style/project/style_variables';

const replaceSuffixPattern = /--(active|big|small|very-big)/g;
const defaultIconProvider = ION;

const icons = { //Define navbar icons
    "ios-menu": [30, styleVariables.navColor],
    "ios-information-circle": [30, styleVariables.navColor],
    "ios-add": [30, styleVariables.navColor],
    "md-close": [30, styleVariables.navColor],
    "md-more": [30, styleVariables.navColor],
    "ios-arrow-back": [30, styleVariables.navColor],
    "ios-search": [30, styleVariables.navColor],
};

global.iconsMap = {};

let iconsLoaded = new Promise((resolve, reject) => { //cache all icons as images so they can be used in the navbar
    new Promise.all(
        Object.keys(icons).map(iconName => {
            const Provider = icons[iconName][2] || defaultIconProvider; // Ionicons
            return Provider.getImageSource(
                iconName.replace(replaceSuffixPattern, ''),
                icons[iconName][0],
                icons[iconName][1]
            )
        })
    ).then(sources => {
        Object.keys(icons)
            .forEach((iconName, idx) => iconsMap[iconName] = sources[idx])

        // Call resolve (and we are done)
        resolve(true);
    })
});

const startApp = () => {

    //Start at login screen
    Navigation.startSingleScreenApp({
            appStyle: {
                orientation: 'portrait',
            },
            screen: {
                title: 'PatientView',
                navBarButtonColor: '#ffffff',
                navigatorStyle: {
                    navBarButtonColor: '#ffffff',
                    screenBackgroundColor: '#fff',
                },
                screen: '/login', //Start at LoginPage
                navigatorButtons: {
                    leftButtons: []
                },
            },
        }
    );
};

//Get navbar icons, launch app

Promise.all([iconsLoaded]).then(() => {
    global.iconsMap = iconsMap;

    global.modalNavButtons = {
        leftButtons: [],
        rightButtons: [
            {
                icon: iconsMap['md-close'], // for icon button, provide the local image asset name
                id: 'close', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
            }
        ]
    };


    if (Platform.OS === 'ios') {
        startApp();
    } else {
        // In android we have to cater for a state where android has been in the background too long
        // https://github.com/wix/react-native-navigation/issues/1022#issuecomment-329432373
        Navigation.isAppLaunched()
            .then((appLaunched) => {
                if (appLaunched) {
                    startApp();
                }
                new NativeEventsReceiver()
                    .appLaunched(startApp);
            })
    }
});

console.disableYellowBox = true;
