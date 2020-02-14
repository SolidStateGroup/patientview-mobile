require('./style_pxToEm');

module.exports = {

    //so 14 is em(1), 28 is em(2)

    //
    // Typography
    // --------------------------------------------------

    // Body text
    // -------------------------

    text: {
        color: colour.text,
        fontSize: em(2)
    },

    textLight: {
        color: colour.textLight,
    },

    textCenter: {
        textAlign: 'center',
    },

    textBottom: {
        textAlignVertical: 'bottom'
    },

    textDanger: {
        fontWeight: 'bold',
        color: colour.danger
    },

    icon: {
        fontSize: em(2)
    },

    anchor: {
        color: pallette.anchor,
        fontWeight: '500',
        fontSize: em(styleVariables.fontSizeAnchor)
    },

    debug: {
        borderWidth: styleVariables.borderWidth,
        borderColor: pallette.brandDanger
    },

    p: {
        marginBottom: styleVariables.marginBaseVertical,
    },

    bold: {
        fontWeight: 'bold'
    },

    // Headings
    // -------------------------

    heading: {
        fontSize: styleVariables.fontSizeHeading,
        color: colour.heading,
        alignSelf: 'center'
    },

    subheading: {
        fontSize: styleVariables.fontSizesubheading,
        color: colour.subheading,
        fontFamily: 'SFUIDisplay-Bold',
        alignSelf: 'center'
    },

    h1: {
        paddingTop: 0,
        fontWeight: styleVariables.headingsFontWeight,
        fontSize: styleVariables.fontSizeH1,
    },

    h2: {
        paddingTop: 0,
        fontSize: styleVariables.fontSizeH2,
        fontWeight: styleVariables.headingsFontWeight,
    },

    h3: {
        paddingTop: 0,
        fontSize: styleVariables.fontSizeH3,
        fontWeight: styleVariables.headingsFontWeight,
        color: pallette.textLight
    },

    italic: {
        fontStyle: 'italic',
    },

};
