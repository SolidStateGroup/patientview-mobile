module.exports = {

    inputContainer: {
        height: styleVariables.inputHeight,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor:'#eaeaea',
        borderRadius: 4,
    },

    textInput: {
        textAlignVertical: "top",
        backgroundColor: styleVariables.inputBackground,
        height: 40,
        paddingLeft: styleVariables.gutterBase,
        fontSize:14,
    },

    label: {
        color: styleVariables.text,
        marginBottom: styleVariables.gutterBase / 2
    },

    labelUnder:{
        marginTop: styleVariables.gutterBase / 2
    },

    headerText: {
        fontSize: styleVariables.fontSizeBase / 1.25,
    },

    formGroup: {
        paddingTop: styleVariables.paddingBase,
        paddingBottom: 0
    },

    checkboxLabel: {
        marginTop: 10,
    },

    tagContainer: {
        height: 40,
        marginRight: 5,
        backgroundColor: '#F9FBFD',
        borderRadius: 50,
    },

    tagText: {
        // fontSize: styleVariables.fontSizeParagraph,
        letterSpacing: 1.2,
        color: '#333333',
    },

    inputDisabled: {
        backgroundColor: '#cccccc',
    },

    inputAccessoryViewContainer: {
        backgroundColor: '#eaeaea',
        height: 44,
        justifyContent: 'center',
    },

    inputAccessoryViewDone: {
        color: 'blue',
        alignSelf: 'flex-end',
        marginRight: 10,
    },

};
