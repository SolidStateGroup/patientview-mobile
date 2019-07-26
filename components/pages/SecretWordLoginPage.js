/**
 * Created by kylejohnson on 28/01/2017.
 * Enter secret word after login
 */
import React, {Component, PropTypes} from 'react';

const SecretWordLoginPage = class extends Component {
    static navigatorStyle = global.navbarStyle;

    state = {}

    componentWillMount() {
        routeHelper.handleNavEvent(this.props.navigator, 'secret-word', this.onNavigatorEvent);
    }

    onNavigatorEvent = (event) => {
        if (event.id == Constants.navEvents.SHOW) {
            Utils.recordScreenView('Secret Word Screen');
        } else if (event.id == Constants.navEvents.HIDE) {
        } else if (event.id == 'close' || event.id == 'back') {
            this.props.navigator.dismissModal();
        }
    };

    componentDidMount = () => {
        //Auto focus the first input
        setTimeout(() => {
            this.input && this.input.focus();
        }, 600)
    };

    lock = () => {
        AppActions.logout();
        SecuredStorage.clear()
        this.props.navigator.resetTo({
            title: 'PatientView',
            screen: '/login', // unique ID registered with Navigation.registerScreen
            navigatorButtons: {
                leftButtons: []
            }, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
        });
    }

    render() {
        return (
            <KeyboardAvoidingView style={{flex: 1}} behavior={ReactNative.Platform.OS == 'ios' ? "padding" : null}
                                  keyboardVerticalOffset={ReactNative.Platform.OS == 'android' ? 64 : 64}>
                <NetworkBar message="It seems you are offline, you need to be online to continue."/>

                <LoginProvider
                    onError={() => this[0] && this[0].focus()}
                    onLock={this.lock}
                    secretWord={true}
                    onLogin={() => {
                        currentScreen == 'secret-word' && this.props.onLogin(this.props.navigator)
                    }}>
                    {(user, {isLoading, error, tries, secretWord}, {login, setSecretWord}) => (

                        <Container style={[Styles.body, {backgroundColor: 'white'}]}>
                            <ScrollView>
                                <Flex style={Styles.centeredContainer}>
                                    <ION style={{fontSize: em(10), color: pallette.text}} name="ios-lock"/>
                                    <H2 style={Styles.label}>Please enter your FULL secret word</H2>
                                    <TextInput
                                        secureTextEntry={true}
                                        ref={(c) => this.input = c}
                                        style={{width: '100%'}}
                                        minLength={7}
                                        placeholder={""}
                                        value={secretWord}
                                        autoCorrect={false}
                                        autoCapitalize="none"
                                        onChangeText={setSecretWord}
                                    />
                                </Flex>
                            </ScrollView>

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
                                <Button
                                    disabled={isLoading || secretWord.length < 7}
                                    onPress={login}>
                                    {isLoading ? 'Logging In' : 'Login'}
                                </Button>
                            </FormGroup>

                        </Container>
                    )}

                </LoginProvider>
            </KeyboardAvoidingView>
        )
    }
};

SecretWordLoginPage.propTypes = {};


module.exports = SecretWordLoginPage;