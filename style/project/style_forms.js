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

};
