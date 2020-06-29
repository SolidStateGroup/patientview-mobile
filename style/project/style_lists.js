module.exports = {

    listContainer: {
        flex: 1,
        backgroundColor: colour.listBackground
    },

    insetList: {
        padding: styleVariables.paddingBase,
        backgroundColor: '#fff'
    },

    listItem: {
        minHeight: 44,
        alignItems: 'stretch',
        borderBottomWidth: 1,
        padding: styleVariables.paddingBase,
        borderBottomColor: colour.divider,
        backgroundColor: colour.listBackground,
    },

    listItemDisabled: {
        opacity: .5
    },

    listItemLast: {
        borderBottomWidth: 0,
    },

    liContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    listItemText: {
        color: pallette.text,
        flex: 1,
    },

    listIcon: {
        fontSize: styleVariables.fontSizeBase * 2.5,
        marginRight: styleVariables.paddingBase,
        width:35,
    },

    listIconINS: {
        fontSize: styleVariables.fontSizeBase * 2.5,
        marginRight: styleVariables.paddingBase,
        width:40,
        height:40,
    },

    listIconNav: {
        fontSize: styleVariables.fontSizeBase * 1.5,
        marginRight: styleVariables.paddingBase,
        color: colour.listItemNav
    },

    listActionIcon: {
        fontSize: styleVariables.fontSizeBase * 2,
        color: styleVariables.listItemText,
    },

    listItemTitle: {
        fontWeight: 'bold'
    },

    listHeader: {
        padding: styleVariables.paddingBase / 2,
        backgroundColor: pallette.listHeader,
    },

    listHeaderText: {
        color: '#fff',
    },

    listSubText: {
        color: colour.textLight,
        fontSize:em(1),
        paddingTop:2,
    },

    listItemUnstyled: {
        borderBottomWidth: 0
    },

    dropButton: {
        height: em(3),
        width: em(3),
        borderRadius: em(3) / 2,
        shadowColor: "#000000",
        shadowOpacity: 0.3,
        shadowRadius: 3,
        shadowOffset: {
            height: 0,
            width: 0
        }
    },

    insDiaryListItem: {
        borderBottomWidth: 1,
        borderBottomColor: colour.divider,
        paddingBottom: styleVariables.paddingBase,
    },
};
