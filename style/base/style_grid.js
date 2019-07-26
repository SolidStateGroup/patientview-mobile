module.exports = {
  //
  // Grid system / Rows
  // --------------------------------------------------

  column: {
    marginLeft: styleVariables.gutterBase,
    marginRight: styleVariables.gutterBase
  },

  col4:{
    width:DeviceWidth / 4
  },

  container: {
    padding: styleVariables.paddingBase,
  },

  noPad: {
    marginLeft: -styleVariables.paddingBase,
    marginRight: -styleVariables.paddingBase,
  },

  containerLoading: {
    opacity: 0.8,
  },

  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  alignCenter: {
    alignSelf: 'center'
  },

  alignRight: {
    alignSelf: 'flex-end'
  },

  centeredRow: {
    flexDirection: 'row',
    justifyContent: 'center'
  },

  row: {
    alignSelf: 'stretch',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
  },

  spacedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }

};
