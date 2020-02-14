require('./style_pxToEm');

const STATUSBAR_HEIGHT = NativeModules.StatusBarManager.HEIGHT || 20;

module.exports = {
    //
    // Navs
    // --------------------------------------------------

    navBarStatic: {
        paddingTop: STATUSBAR_HEIGHT,
        paddingBottom: STATUSBAR_HEIGHT,
        height: styleVariables.baseNavHeight,
        justifyContent: 'center',
    },

    navBar: {
        paddingTop: STATUSBAR_HEIGHT / 2,
        height: styleVariables.baseNavHeight,
        alignSelf: 'stretch',
        justifyContent: 'center',
        backgroundColor: colour.navBar,
    },

    navBarText: {
        color: 'white',
        fontSize: styleVariables.fontSizeHeading,
    },

    navItemContainer: {
        height: styleVariables.baseNavHeight,
        justifyContent: 'center',
    },

    navBarButtonText: {
        fontSize: styleVariables.fontSizeH2,
        color: pallette.text
    },

    navBarTitle: {
        fontSize: styleVariables.fontSizeH2,
        color: colour.navBarText,
        fontWeight: styleVariables.headingsFontWeight
    },
    navItem: {
        height: 44,
        justifyContent: 'center'
    },

    // Tabs
    // -------------------------


    tabText: {
        color: colour.tabText,
        textAlign: 'center'
    },
    tabActive: {
        backgroundColor: colour.tabActive
    },

    // Bar
    // -------------------------

    bar: {
        padding: styleVariables.paddingBase,
        backgroundColor: colour.secondary
    },
    barText: {
        fontWeight: 'bold',
        color: colour.buttonText,
        fontSize: styleVariables.fontSizesubheading
    },

    // Menu
    // -------------------------

    menu: {
        backgroundColor: colour.menu,
        position: "absolute",
        top: 0,
        left: 0,
        width: Dimensions.get("window").width / 1.5,
        borderRightWidth: 1 / PixelRatio.get(),
        borderColor: pallette.divider,
        height: Dimensions.get("window").height
    },
    menuIcon: {
        fontSize: styleVariables.fontSizeIcon,
        color: colour.primary,
        marginRight: styleVariables.marginBaseHorizontal
    },
    menuText: {
        color: 'white'
    },
    menuHeading:{
        height:styleVariables.baseNavHeight + 20,
        justifyContent:'center'
    },
    menuHeadingText: {
        fontSize: styleVariables.fontSizeH2,
        color: colour.text,
    },

    menuButtonImage: {
        width: 34,
        height: 34,
        marginRight: 5,
        borderRadius: 5
    },

    listItemIcon: {
        fontSize: em(2),
        marginTop: -em(0.5),
        marginBottom: -em(0.5)
    },

    menuShadow:{
        // marginLeft:10,
        shadowColor: "#000000",
        shadowOpacity: 0.5,
        shadowRadius: 2,
        shadowOffset: {
            height: 0,
            width: -5
        }
    },

    tabBar: {
        backgroundColor: colour.navBar,
    },

    tabBarLabel: {
        color: 'white',
    },

    tabBarIndicator: {
        backgroundColor: 'white',
    },

    tabBarTab: {
        width: 150,
    },
};
