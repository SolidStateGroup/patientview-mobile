import {AppState, AsyncStorage} from 'react-native';
const SESSION_KEY = "__SESSION_TIMER__";
let currentState = true;
let interval = null;
let _callback = null;
// active - The app is running in the foreground
// background - The app is running in the background. The user is either in another app or on the home screen

// inactive - This is a state that occurs when transitioning between
// foreground & background, and during periods of inactivity such as
// entering the Multitasking view or in the event of an incoming call


const checkSession = () => {
    if (_callback) {
        if (!interval) {
            interval = setInterval(() => {
                AsyncStorage.setItem(SESSION_KEY, new Date().valueOf() + "");
            }, 1000);
        }
        AsyncStorage.getItem(SESSION_KEY, async (err, res) => {
            if (res) {
                // Immediately update the session time to prevent issues with biometric methods
                // that prevent the interval from running
                // It is expected that if you are on the biometric screen for longer than the
                // challenge timeout then you will be immediately re-prompted
                await AsyncStorage.setItem(SESSION_KEY, new Date().valueOf() + "");
                _callback(new Date().valueOf() - parseInt(res));
            }
            if (err) {
                console.warn('react-native-session-length: ' + err);
            }
        });
    }
};


function sessionLength (callback) {
    _callback = callback;
    checkSession();
    AppState.addEventListener('change', (nextAppState) => {
        var isActive = nextAppState == 'active';

        if (currentState !== isActive) {
            currentState = isActive;
            if (isActive) { //App is now active, callback with how long ago the last session was
                checkSession();
            } else {//App is inactive, stop recording session
                interval && clearInterval(interval);
            }
        }
    });
};


//Calls back when app is in foreground with the date value of the last active session
module.exports =  sessionLength;
