import _ from 'lodash';
global._ = _;

import moment from 'moment';
global.moment = moment;

window.Project = require('../common/project');
window.Utils = require('../common/utils');
window.Format = require('../common/format');

import Dispatcher  from'../common/dispatcher/dispatcher';
import AppActions  from'../common/dispatcher/app-actions';
import Actions  from'../common/dispatcher/action-constants';
global.Dispatcher = Dispatcher;
global.AppActions = AppActions;
global.Actions = Actions;

import ION from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
global.FontAwesome = FontAwesome;
global.ION = Animated.createAnimatedComponent(ION);
global.MaterialIcon = MaterialIcon;

import LinearGradient from 'react-native-linear-gradient';
global.LinearGradient = LinearGradient;


// import {
//     Analytics,
//     Hits as GAHits,
//     Experiment as GAExperiment
// } from 'react-native-google-analytics';
// global.GA_ID = 'UA-92685907-1';
// global.Analytics = Analytics;
// global.GAHits = GAHits;
// let clientId = DeviceInfo.getUniqueID();
// global.ga = new Analytics(GA_ID, clientId, 1, DeviceInfo.getUserAgent());

import DeviceInfo from 'react-native-device-info';
global.DeviceInfo = DeviceInfo;

import Share from 'react-native-share';
global.Share = Share;

import Animation from 'lottie-react-native';
global.Animation = Animation;

// import DatePicker from 'react-native-datepicker';
// global.DatePicker = DatePicker;
import RNFS from 'react-native-fs'
global.RNFS = RNFS;

import{Navigation} from 'react-native-navigation';
global.Navigation = Navigation;

import VideoPlayer from '../components/VideoPlayer';
global.VideoPlayer = VideoPlayer;

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
global.KeyboardAwareScrollView = KeyboardAwareScrollView;

global.SecuredStorage = require('./react-native-secured-storage');

import {CachedImage} from 'react-native-cached-image'
global.CachedImage = CachedImage;