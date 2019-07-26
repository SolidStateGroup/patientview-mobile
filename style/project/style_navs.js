//https://github.com/wix/react-native-navigation/wiki/Styling-the-navigator
window.navbarStyle = {
    topBarElevationShadowEnabled: false,
    navBarNoBorder: true,
    navBarBackgroundColor: styleVariables.navBar,
    navBarTextColor: colour.navBarText,
    navBarSubtitleColor: colour.navBarText,
    navBarSubtitleFontSize: 13,
    navBarButtonColor: '#ffffff',
};

window.navbarHidden = { navBarHidden: true };


module.exports = {

    fakeNav: {
        paddingTop: styleVariables.statusHeight,
        paddingBottom: styleVariables.statusHeight,
        backgroundColor: styleVariables.navBar
    },

    navBarText: {
        color: 'white',
        fontSize: styleVariables.fontSizeHeading,
    },

    navBar: {},

    barText: {},

    navIcon: {
        color: 'white',
        fontSize: styleVariables.fontSizeIcon
    },

    //OFF CANVAS

    navButtonRight: {
        alignItems: 'flex-end',
    },

    navButtonLeft: {
        alignItems: 'flex-start',
    },

    menu: {
        height: DeviceHeight
    },

    menuItem: {
        height: 44,
        justifyContent: 'flex-start',
    },
    menuItemActive: {},

    menuItemText: {
        fontSize: em(1.5),
        color: styleVariables.text,
        backgroundColor: 'transparent'
    },
    menuItemIcon: {
        fontSize: em(2),
        color: styleVariables.text,
        backgroundColor: 'transparent'
    },
};
