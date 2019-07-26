module.exports = {

    // APP
    navContent: {
        padding: styleVariables.gutterBase
    },
    alertSuccess: {
        backgroundColor: "#dff0d8",
        padding:10,
        paddingBottom:10
    },

    alertWarn: {
        backgroundColor: "#fcf8e3",
        padding:10
    },

    greyBackground:{
        backgroundColor:'#e7ecf2',
    },

    whiteContainer:{
        backgroundColor:'#fff',
    },

    //ICONS
    iconDefault: {
        height: 30,
        resizeMode: 'contain'
    },

    avatar: {
        width:32,
        height:32,
        borderRadius:16
    },

    iconButton: {
        height: 25,
        resizeMode: 'contain'
    },

    dropListIcon: {
        fontSize: em(1.2),
        color: styleVariables.white
    },

    // APP
    stationName: {
        width: DeviceWidth / 3.3,
    },

    badge: {
        borderRadius: 4,
        backgroundColor: pallette.new,
        padding: 2
    },
    badgeText: {
        color: colour.btnText,
        fontWeight: 'bold',
        fontSize:em(1)
    }
};
