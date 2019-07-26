module.exports = {
  // Utility classes
  // -------------------------

  padded: {
    padding: styleVariables.paddingBase,
  },
  noPadding: {
    paddingBottom: 0,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0
  },

  center: {
    textAlign: 'center'
  },

  centerChildren: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  fullScreen: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: Dimensions.get("window").height,
  },

  backdrop: {
    flex: 1,
    backgroundColor: styleVariables.backdropBackground
  },

  iconMiddle:{
    paddingLeft:10,
    paddingRight:10,
  },
};
