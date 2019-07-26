const minute = 60000;
const day = 86400000;
const hour = 3600;
module.exports = {
    debug: false,
    appVersion: 1,
    challengeTimeout:minute*15,
    sessionTimeout:day*30,
    messagePollingInterval: 20000,
    topic: '-results',
    topicMessages: '-messages',
    env: 'prod',
    // api: 'https://7d34d656.ngrok.io/api/'
    api: 'https://patientview.org/api/'
};