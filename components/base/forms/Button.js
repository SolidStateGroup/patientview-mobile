//Button component with string/component child support
//Uses android native ripple effect if it's supported

module.exports = Button;
import {Platform} from 'react-native';
import React, {Component, PropTypes} from 'react';

const Button = class extends Component {
  displayName: 'Button';

  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  render() {
    var touchableProps = {
      activeOpacity: this._computeActiveOpacity(),
    };

    if (!this.props.disabled) {
      touchableProps.onPress = this.props.onPress || this.props.onClick;
      touchableProps.onPressIn = this.props.onPressIn;
      touchableProps.onPressOut = this.props.onPressOut;
      touchableProps.onLongPress = this.props.onLongPress;
    }

    //compute styles e.g. buttonGroupLeft, big, bigRight, buttonGroupText, bigText, but
    var groupStyle = [Styles.buttonGroup,
      this.props.position && styles['buttonGroup' + Format.camelCase(this.props.position)],
      this.props.variation && styles['buttonGroup' + Format.camelCase(this.props.variation)],
      this.props.variation && this.props.position && styles[this.props.variation + Format.camelCase(this.props.position)],
      this.props.style
    ];

    var textStyle = [Styles.buttonText,
      this.props.position && styles['buttonText' + Format.camelCase(this.props.position) + "Text"],
      this.props.variation && styles['buttonText' + Format.camelCase(this.props.variation)],
      this.props.variation && this.props.position && styles[this.props.variation + Format.camelCase(this.props.position) + "Text"],
      this.props.textStyle
    ];

    return Platform.OS == "android" && Platform.Version >= 21 ? (
        <View style={{opacity: this.props.disabled ? 0.5 : 1}}>
          <TouchableNativeFeedback
              {...touchableProps}
              background={TouchableNativeFeedback.Ripple('rgba(255,255,255,.5)')}
          >
            <View style={groupStyle}>
              {typeof this.props.children == "string" ? (
                  <Text style={textStyle}>{this.props.children}</Text>
              ) : this.props.children}
            </View>
          </TouchableNativeFeedback>
        </View>
    ) : (
        <View style={{opacity: this.props.disabled ? 0.5 : 1}}>
          <TouchableOpacity {...touchableProps}
                            style={groupStyle}>
            {typeof this.props.children == "string" ? (
                <Text pointerEvents="none" style={textStyle}>{this.props.children}</Text>
            ) : this.props.children}
          </TouchableOpacity>
        </View>
    );
  }

  _computeActiveOpacity() {
    if (this.props.disabled) {
      return 1;
    }
    return colour.buttonActiveOpacity;
  }
}

Button.propTypes = {
  onPress: OptionalFunc, //What to do on press
  onPressIn: OptionalFunc, //What to do on press in
  onPressOut: OptionalFunc, //What to do on press out
  onLongPress: OptionalFunc, //What to do on long press
  style: React.PropTypes.any,
  textStyle: OptionalObject, // style for the button text
  disabled: OptionalBool, // whether the button is disabled
  variation: OptionalString // a way to use predefined style variations (e.g. large, warning)
}

module.exports = Button;
