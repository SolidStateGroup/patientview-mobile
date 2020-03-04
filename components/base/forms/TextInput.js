/**
 * Created by kylejohnson on 14/11/2015.
 */

import InputMask from 'inputmask-core';

const Input = class TextInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            height: new Animated.Value(this.getHeight(this.props.value || ""))
        };
    }

    clear = () => {
        this.refs.input.clear();
    }
    blur = () => {
        if (this.refs && this.refs.input)
        this.refs.input.blur();
    }
    focus = () => {
        this.refs.input.focus();
    }

    componentWillReceiveProps(newProps) {
        if (this.props.multiline && this.props.maxLines && newProps.value != this.props.value) {
            Animated.timing(this.state.height, {
                toValue: this.getHeight(newProps.value),
                duration: 200
            }).start();
        }
    }

    onChangeText = (text) => { // @TODO use more familiar onChange
        if (this.props.mask) {
            // Masking
            if (!this.mask) {
                // Create new mask
                this.mask = new InputMask({
                    pattern: this.props.mask,
                    formatCharacters: {
                        'a': {
                            validate(char) {
                                return /[ap]/.test(char);
                            }
                        },
                        'm': {
                            validate(char) {
                                return /\w/.test(char);
                            },
                            transform() {
                                return 'm';
                            }
                        }
                    }
                });
            }

            if (text.length > this.mask.selection.start) {
                // Character(s) were typed, ignore if text exceeds length of mask
                if (this.mask.selection.start === this.props.mask.length) {
                    return;
                }

                // It does not, extract the character(s) that were added
                text = text.slice(this.mask.selection.start);

                // Add it to the input mask
                if (text.length > 1) {
                    this.mask.paste(text);
                }
                else {
                    // Perform additional inputs to skip non-pattern characters. Input will be converted
                    // to the non-pattern character.
                    while (!this.isMaskPatternChar(this.props.mask[this.mask.selection.start]) &&
                    this.mask.selection.start !== this.props.mask.length) {
                        // On failure abort loop as cursor position will not change
                        if (!this.mask.input(text)) {
                            break;
                        }
                    }

                    this.mask.input(text);
                }
            }
            else if (text.length < this.mask.selection.start) {
                // Character(s) were deleted, delete up to current length
                while (this.mask.selection.start != text.length)
                    this.mask.backspace();

                // Check whether more backspaces are required until we reach a pattern char or nothing is left
                while (this.mask.selection.start && !this.isMaskPatternChar(this.props.mask[this.mask.selection.start - 1])) {
                    this.mask.backspace();
                }
            }

            // Update text
            this.props.onChangeText(this.mask.getValue().slice(0, this.mask.selection.start));
        }
        else {
            // No masking, just update text
            this.props.onChangeText(text);
        }
    }

    isMaskPatternChar(char) {
        if (!char || char.length !== 1) {
            return false;
        }

        return char === '1' || char === 'a' || char === 'A' || char === '*' || char === '#';
    }

    getHeight(text) {
        var lines = text.match(/\n/g);
        var linesToShow = Math.min(Math.max((lines && lines.length || 0), (this.props.minLines || 0)), this.props.maxLines);
        if (isNaN(linesToShow)) {
            linesToShow = 0;
        }
        return (linesToShow * 16) + (this.props.height || styleVariables.inputHeight);
    }

    render() {
        return (
            <Animated.View onStartShouldSetResponderCapture={this.props.onPress}
                           style={[Styles.inputContainer, this.props.style, { height: this.state.height }]}>
                <ReactNative.TextInput
                    placeholderTextColor={styleVariables.placeholderTextColor}
                    ref={"input"}
                    autoCorrect={this.props.autoCorrect === false ? false : true}
                    maxLength={this.props.maxLength}
                    onChangeText={this.onChangeText}
                    multiline={this.props.multiline}
                    secureTextEntry={this.props.secureTextEntry}
                    onFocus={this.props.onFocus}
                    onBlur={this.props.onBlur}
                    underlineColorAndroid={'transparent'}
                    value={this.props.value}
                    blurOnSubmit={this.props.multiline ? false : true}
                    placeholder={this.props.placeholder}
                    editable={this.props.editable || !this.props.disabled}
                    style={[Styles.textInput, this.props.textStyle, {flex: 1}]}
                    onSubmitEditing={this.props.onSubmit}
                    keyboardType={this.props.keyboardType}
                    inputAccessoryViewID={this.props.inputAccessoryViewID}
                />
            </Animated.View>
        );
    }
};

Input.propTypes = {
    value: OptionalString,
    placeholder: OptionalString,
    editable: OptionalBool,
    multiline: OptionalBool,
    maxLines: OptionalNumber,
    minLines: OptionalNumber,
    mask: OptionalString,
    onChangeText: OptionalFunc,
    height: OptionalNumber,
    style: React.PropTypes.any,
    secureTextInput: OptionalBool,
    disabled: OptionalBool,
    keyboardType: OptionalBool,
    onSubmit: OptionalFunc,
    onFocus: OptionalFunc,
    textStyle: oneOfType([OptionalObject, OptionalNumber]),
};

module.exports = Input;
