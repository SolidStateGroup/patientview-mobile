const minute = 60000;
const hour = 3600000;
const day = hour*24;
module.exports = {
    debug: false,
    appVersion: 1,
    challengeTimeout:minute*15,
    sessionTimeout:day*30,
    messagePollingInterval: 20000,
    topic: '-test-results',
    topicMessages: '-test-messages',
    env: 'prod',
    // api: 'https://7d34d656.ngrok.io/api/'
    api: 'https://test.patientview.org/api/'
};
