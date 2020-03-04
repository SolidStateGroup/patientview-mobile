import {NativeModules,PixelRatio} from 'react-native';
var em = require('../base/style_pxToEm');
window.pallette = {
    backgroundBase: '#ffffff',

    primary: '#368de8',
    primaryDark: '#2085d6',
    primaryTranslucent: 'rgba(50,140,255,.5)',
    secondary: '#00adc6',
    third: '#c84d38',

    new:'#f0ad4e',

    text: '#585858',
    textWhite:'#fff',
    textLight: '#a8a8a8',
    rowText: '#7f7f7f',
    textLightest: '#f0f0f0',
    textLightestHighlight: '#e2e2e2',
    divider: '#eaeaea',
    greyBorder:'#cfdce9',

    error: '#f2dede',
    errorTranslucent: 'rgba(221,75,57,0.70)',

    fromGradient:'#fafafa',
    toGradient:'#fff',

    anchor:'#a8a8a8',

};

window.colour = {
    bodyBackground: 'transparent', //General app  background
    //BUTTON / SELECT COLOURS
    btnText: pallette.textWhite,
    btnDefault: pallette.secondary,
    btnAlt: pallette.secondary,
    btnSecondary: pallette.primary,
    success: '#4ea949',
    danger: '#c84d38',
};

window.styleVariables =  Object.assign({

    lines:[pallette.primary,"#4ede55"],
    circles:[pallette.primaryDark,"#46bf4d"],

    //SCAFFOLD
    statusHeight: NativeModules.StatusBarManager.HEIGHT || 20,
    baseNavHeight: 54,
    marginBaseVertical: 10,
    marginBaseHorizontal: 10,
    paddingBase: 10,
    paddingList: em(1.1),
    gutterBase: 10,
    borderRadiusDefault: 4,

    //BASE
    borderWidth: 2 / PixelRatio.get(),
    borderDefault: pallette.textLight,

    //TYPE
    fontSizeBase: em(1.2),
    fontSizeSmall: em(0.9),
    fontSizeHeading: em(1.5),
    fontSizeSubHeading: em(1.3),

    fontSizeIcon: 30,

    fontSansSerif: 'helvetica neue',

    text: pallette.text, //General app text colour
    textLight: pallette.textLight, //Light app text colour

    //FORMS
    inputHeight: 54, //Need to change this value in both platform variables files at the moment
    inputText: pallette.text,
    inputBackground: pallette.backgroundBase,
    inputBorder: pallette.textLightest,

    //NAV
    navBar: pallette.primary,
    navBarIcon: pallette.textLight,
    navBarButtonText: pallette.text,
    navBarBorder: pallette.primary,
    navBarText: pallette.white,

    //MODALS
    modalBackground: '#F0F0F0',


    //BUTTONS
    buttonHeight: 50,
    //BUTTON / SELECT COLOURS
    btnText: pallette.buttonText,
    btnDefault: pallette.secondary,
    btnAlt: pallette.primary,


    buttonPrimary: pallette.secondary,
    buttonTextLight: pallette.textLight
}, require('./style_platform_variables'));
