module.exports = {

    //
    // Base styles
    // --------------------------------------------------

    body: {
        flex: 1,
        backgroundColor: colour.bodyBackground
    },

    divider: {
        height: (1 / PixelRatio.get()) * 2,
        alignSelf: 'stretch',
        borderColor: colour.divider,
        borderBottomWidth: 1 / PixelRatio.get(),
    },

};
