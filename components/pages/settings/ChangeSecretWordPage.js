/**
 * Created by kylejohnson on 28/01/2017.
 */
import React, {Component, PropTypes} from 'react';
const HomePage = class extends Component {

    static navigatorStyle = global.navbarStyle;

    displayName: 'HomePage'

    constructor(props, context) {
        super(props, context);
        this.state = {
            oldSecretWord: '',
            secretWord1: '',
            secretWord2: '',
        };
        ES6Component(this);
    }

    componentWillMount() {
        routeHelper.handleNavEvent(this.props.navigator, 'secret-word-settings', this.props.onNavigatorEvent);
        this.listenTo(AccountStore, 'change', () => {
            this.setState({ isSaving: AccountStore.isLoading, error: AccountStore.error });
        });
        this.listenTo(AccountStore, 'settings-saved', () => {
            this.setState({ hasSaved: true,oldSecretWord: '',secretWord1:'',secretWord2:'' });
        });

    }

    onNavigatorEvent = (event) => {
        if (event.id == Constants.navEvents.SHOW) {
            Utils.recordScreenView('Change Secret Word Settings');
        } else if (event.id == Constants.navEvents.HIDE) {

        } else if (event.id == 'close') {
            this.props.navigator.dismissModal();
        }
    };

    submit = () => {
        dismissKeyboard();
        AppActions.changeSecretWord(this.state.secretWord1, this.state.oldSecretWord);
    };


    render() {
        const { email, confirmEmail, contactNumber, hasSaved, error } = this.state;
        const isValid = this.state.oldSecretWord && this.state.secretWord1 == this.state.secretWord2 && this.state.secretWord1.length >= Constants.secretWordLength;
        return (
            <KeyboardAvoidingView style={{ flex: 1 }}
                                  behavior={ReactNative.Platform.OS == 'ios' ? "padding" : "padding"}
                                  keyboardVerticalOffset={ReactNative.Platform.OS == 'android' ? -264 : 70}>
                <NetworkBar message="It seems you are offline, you need to be online to change your secret word."/>
                <Container style={Styles.body}>
                    <Flex>
                        <KeyboardAwareScrollView extraScrollHeight={ReactNative.Platform.OS == 'ios' ? -40:0}>
                            <FormGroup>
                                <Text style={Styles.center}>
                                    A secret word adds an extra level of security when you login. You can create or update your secret word below, one that is easily remembered.
                                    {'\n\n'}
                                    The minimum length for a secret word is 7 characters, must be letters not numbers.
                                </Text>
                            </FormGroup>
                            <FormGroup>
                                <TextInput
                                    ref={(ref)=>this.input = ref}
                                    secureTextEntry={true}
                                    placeholder="Current Secret Word"
                                    value={this.state.oldSecretWord}
                                    onChangeText={(oldSecretWord) => this.setState({ oldSecretWord:oldSecretWord.toUpperCase() })}
                                />
                            </FormGroup>
                            <FormGroup>
                                <TextInput
                                    secureTextEntry={true}
                                    placeholder="New Secret Word"
                                    value={this.state.secretWord1}
                                    onChangeText={(secretWord1) => this.setState({ secretWord1:secretWord1.toUpperCase() })}
                                />
                            </FormGroup>
                            <FormGroup>
                                <TextInput
                                    maxLength={20}
                                    secureTextEntry={true}
                                    placeholder="Confirm Secret Word"
                                    value={this.state.secretWord2}
                                    onChangeText={(secretWord2) => this.setState({ secretWord2:secretWord2.toUpperCase() })}
                                />
                            </FormGroup>
                            <Fade autostart value={hasSaved}>
                                <View style={Styles.panel}>
                                    <Row>
                                        <Column>
                                            <ION style={{ color: colour.textLight, fontSize: em(2) }}
                                                 name="ios-checkmark-circle"/>
                                        </Column>
                                        <Column>
                                            <Text style={Styles.center}>Your details have been saved!</Text>
                                        </Column>
                                    </Row>
                                </View>
                            </Fade>
                        </KeyboardAwareScrollView>
                    </Flex>

                    <FormGroup>
                        {
                            error ?
                                <Fade autostart={true} value={error}>
                                    <Text style={[Styles.center, Styles.error]}>
                                        Incorrect details provided, please try again.
                                    </Text>
                                </Fade>
                            : null}
                    </FormGroup>


                    <FormGroup>
                        <Button disabled={!isValid} onPress={this.submit}>
                            {this.state.isSaving ? 'Saving' : 'Save'}
                        </Button>
                    </FormGroup>
                </Container>
            </KeyboardAvoidingView>
        )
    }
};

HomePage.propTypes = {};


module.exports = HomePage;