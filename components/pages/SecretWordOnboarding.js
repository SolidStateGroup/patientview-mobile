/**
 * Created by kylejohnson on 28/01/2017.
 * Secret word onboarding for logged in user who doesn't have a secret word
 */
import React, {Component, PropTypes} from 'react';
import AccountStore from '../../common/stores/account-store';
const SecretWordOnboarding = class extends Component {
    static navigatorStyle = global.navbarStyle;

    constructor(props, context) {
        super(props, context);
        this.state = {
            secretWord1: "",
            secretWord2: "",
            password1: "",
            password2: "",
        };
        ES6Component(this);
    }

    componentWillMount() {
        this.listenTo(AccountStore, 'settings-saved', () => {
            this.props.navigator.dismissModal();
        });
        this.listenTo(AccountStore, 'change', () => {
            this.setState({ error: AccountStore.error, isLoading: AccountStore.isLoading })
        });
        routeHelper.handleNavEvent(this.props.navigator, 'set-secret-word', this.onNavigatorEvent);
    }

    onNavigatorEvent = (event) => {
        if (event.id == Constants.navEvents.SHOW) {
            dismissKeyboard();

            Utils.recordScreenView('Set Secret Word Onboarding');
        } else if (event.id == Constants.navEvents.HIDE) {
        }
    };

    submit = () => {
        AppActions.changeSecretWord(this.state.secretWord1, '', this.state.password1)
    };

    isValid = () => {
        //Secret word and password must be at least 7 characters and at equal to their confirmation
        const {password1,password2,secretWord1,secretWord2} = this.state;
        const secretWordIsValid = secretWord1 === secretWord2 && secretWord1.length >= Constants.secretWordLength;
        if (AccountStore.shouldSetPassword()) {
            return secretWordIsValid &&
                password1 === password2 && password1.length >= Constants.secretWordLength;
        }
        return secretWordIsValid;
    };


    render() {
        const { error } = this.state;
        return (
            <KeyboardAvoidingView style={[{ flex: 1 }, Styles.body,Styles.whiteContainer]}
                                  behavior={ReactNative.Platform.OS == 'ios' ? "padding" : "padding"}
                                  keyboardVerticalOffset={ReactNative.Platform.OS == 'android' ? -264 : 70}>

                <NetworkBar message="It seems you are offline, you need to be online to set your secret word."/>
                <Container style={[Styles.body, { flex: 1 }]}>
                    <Flex>
                        <KeyboardAwareScrollView extraHeight={180}>
                            <View style={Styles.paddedContainer}>
                                <FormGroup>
                                    <H2 style={[Styles.center, Styles.bold]}>
                                        A secret word adds an extra level of security when you login.
                                    </H2>
                                </FormGroup>

                                <FormGroup>
                                    <Text style={[Styles.center, Styles.listSubText]}>
                                        The minimum length for a secret word is 7 characters, must be letters not
                                        numbers.
                                    </Text>
                                </FormGroup>
                            </View>
                            <FormGroup>
                                <TextInput
                                    ref={(ref) => this.input = ref}
                                    secureTextEntry={true}
                                    placeholder="Secret Word"
                                    value={this.state.secretWord1}
                                    onChangeText={(secretWord1) => this.setState({ secretWord1 })}
                                />
                            </FormGroup>

                            <FormGroup>
                                <TextInput
                                    secureTextEntry={true}
                                    placeholder="Confirm Secret Word"
                                    value={this.state.secretWord2}
                                    onChangeText={(secretWord2) => this.setState({ secretWord2 })}
                                />
                            </FormGroup>

                            {/*If the new user is brand new they should enter their password here*/}
                            {AccountStore.shouldSetPassword() && (
                                <View>
                                    <View style={Styles.paddedContainer}>
                                        <FormGroup>
                                            <Text style={[Styles.center, Styles.bold]}>
                                                Please enter a memorable password.
                                            </Text>
                                        </FormGroup>

                                        <FormGroup>
                                            <Text style={[Styles.center, Styles.listSubText]}>
                                                The minimum length for a password is 7 characters.
                                            </Text>
                                        </FormGroup>
                                    </View>
                                    <FormGroup>
                                        <TextInput
                                            secureTextEntry={true}
                                            placeholder="New Password"
                                            value={this.state.password1}
                                            onChangeText={(password1) => this.setState({ password1 })}
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <TextInput
                                            secureTextEntry={true}
                                            placeholder="Confirm New Password"
                                            value={this.state.password2}
                                            onChangeText={(password2) => this.setState({ password2 })}
                                        />
                                    </FormGroup>

                                </View>
                            )}
                        </KeyboardAwareScrollView>
                    </Flex>

                    <FormGroup>
                        {
                            error ?
                            <Fade autostart={true} value={error}>
                                <Text style={[Styles.center, Styles.error]}>
                                    {error}
                                </Text>
                            </Fade>
                        : null}
                    </FormGroup>

                    <FormGroup>
                        <Button onPress={this.submit} disabled={!this.isValid() || this.state.isLoading}>
                            {this.state.isLoading ? 'Saving' : 'Save Settings'}
                        </Button>
                    </FormGroup>

                </Container>
            </KeyboardAvoidingView>
        )
    }
};

SecretWordOnboarding.propTypes = {};


module.exports = SecretWordOnboarding;