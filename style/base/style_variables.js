/**
 * Created by kylejohnson on 18/04/2016.
 */
import {NativeModules,PixelRatio} from 'react-native';
var em = require('../base/style_pxToEm');
window.pallette = Object.assign({}, {

    //primary
    primary: '#fff',
    secondary: '#f5f5f5',

    cancel: '#acafb7',
    cancelDark: '#7c828f',

    //text

    text: '#333',
    textLight: '#333',
    textLightest: '#B6B6B6',
    textLightestHighlight: '#CDCDCD',
    buttonText: 'white',
    divider: '#dbdbdb',

    //radio, checkbox switch etc

    toggle: '#B6B6B6',
    toggleAlt: '#CDCDCD',
    toggleActive: '#3CBF88',
    toggleActiveAlt: '#46D899',


    grayLighter: '#eaeaea',
    warning: '#DE000B',
    warningText: '#fff',
    dark: '#333',
    white: '#fff',
    brandDanger: '#d9534f',
    success: '#3CBF88',

    anchor: '#0066ff',

    // buttons
    btnPrimary: '#fff',

}, window.pallette);

//== Other Variables

window.styleVariables = Object.assign({

    //== Typography
    //
    //## Font, line-height, and color for body text, headings, and more.
    cardBackground:'#fff',
    inputHeightLarge: 54,
    fontSansSerif: 'helvetica',
    fontSerif: 'helvetica',
    fonstSizeParagraph: em(1.1),
    fontSizeAnchor: em(1.1),
    fontSizeHeading: em(1.7),
    fontSizesubheading: em(1.2), //18px
    fontSizeH1: em(2.286), //32px
    fontSizeH2: em(1.2), //18px
    fontSizeH3: em(0.714), //10px
    fontSizeNote: em(0.786), //11px
    fontSizelistitem: em(1), //10px
    fontSizelistTitle: em(0.857), //12px
    fontSizeInputLarge: em(2),
    fontSizeAlert: em(1.1),
    fontSizeIcon: em(2),
    heroFontSize: em(5.2),
    headingsFontWeight: 'bold',
    mediumFontWeight: '300',
    fontSizeAnchorIcon: em(2),

    fontSizeAnchorLarge: em(2),
    fontSizeAnchorIconLarge: em(2.6),

    button: 44,
    buttonTall: 54,

    //== Components
    logoSize: 100,
    //
    //## Define common padding and border radius sizes and more.

    baseNavHeight: 44,
    marginBaseVertical: 10,
    marginBaseHorizontal: 10,
    paddingBase: 10,
    gutterBase: 5,
    borderWidth: 1,
    borderBottomWidth: 2 / PixelRatio.get(),
    disabledOpacity: 0.2,
    borderRadiusDefault: 8,

    //## Notifications

    notificationWidth: 18,
    notificationHeight: 18,
    notificationBorderRadius: 12,
    notificationFontSize: 9,

    //Avatars
    avatarWidth: 64,
    avatarHeight: 64,
    avatarRadius: 32,

    avatarSmallWidth: 32,
    avatarSmallHeight: 32,
    avatarSmallRadius: 16,

    //Posts
    postWidth: 500,
    postHeight: 500,
}, window.styleVariables);

window.colour = Object.assign({}, pallette, {
    iosStyle: 0,
    danger: '#dd4b39',
    buttonActiveOpacity: 0.8,
    disabledOpacity: 0.8,
    bodyBackground: '#ffffff', //General app  background
    backdropBackground: 'rgba(0,0,0,0.2)',

    //text
    text: pallette.text, //General app text colour
    anchor: pallette.anchor, //General app text colour
    textLight: pallette.textLight, //General app text colour
    label: pallette.textLightest, //text color for labels

    //input
    input: pallette.text,
    inputBackground: '#fff',
    inputBorder: pallette.divider,
    placeholderTextColor: pallette.textLight,
    disabledText: pallette.textLight,

    //radio
    radio: '#ffffff',
    radioBorder: pallette.toggle,
    radioText: pallette.text,
    radioTextActive: pallette.text, //text color for labels
    radioActive: pallette.toggleActive,
    radioActiveBorder: pallette.toggleActive,

    //tabs
    tabIcon: pallette.primaryDark,
    tabBackground: 'white',
    tabActive: pallette.primary,
    tabText: pallette.text,

    //notifications
    notification: pallette.primary,
    notificationText: '#fff',

    //switch
    switch: pallette.toggle,
    switchBackground: pallette.toggleAlt,
    switchActive: pallette.toggleActive, //text color for labels
    switchActiveBackground: pallette.toggleActiveAlt, //text color for labels

    //Menu.js
    menuDivider: pallette.divider,
    menu: pallette.secondary,
    menuItemText: pallette.text,

    // list items
    listBackground: 'white',
    listItem: 'white',
    listItemNav: '#d9d9d9',
    listItemDivider: pallette.divider,

    dividerAlt: pallette.secondary,

    // Loader.js
    loader: pallette.text,

    //BUTTON / SELECT COLOURS
    btnText: pallette.buttonText,
    btnDefault: pallette.primary,
    btnAlt: pallette.primary,

    modalBackground: 'white',

    panel: '#f1f1f1',

    //nav
    navBar: pallette.primary,
    navBarIcon: 'white',
    navBarButtonText: 'white',
    navBarBorder: 'transparent',
    navBarText: 'white',
    alert: 'red',
    avatar: "#dbdbdb",

    facebook: '#3b5998',
    twitter: '#1DA1F3',
    google: '#dd4b39'

}, window.colour);
