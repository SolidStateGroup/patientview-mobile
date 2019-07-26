
import 'react-native-globals';
import './prop-types'
import './window'; //platform specific globals
import './libs';

//Flux Stuff

//adds styleVariables navbarSt
require('../style/style_screen');
require('./base_components');
require('./project_components');
require('./Constants');
import routeHelper from '../route-helper';
global.routeHelper = routeHelper;
//
global.API = require('./api');
global.AjaxHandler = require('../common/ajax-handler');


import dismissKeyboard from 'dismissKeyboard';
global.dismissKeyboard = dismissKeyboard;