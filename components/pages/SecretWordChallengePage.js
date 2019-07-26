/**
 * Created by kylejohnson on 28/01/2017.
 * Enter secret word after login
 */
import React, {Component, PropTypes} from 'react';
import dismissKeyboard from 'dismissKeyboard'

const SecretWordChallengePage = class extends Component {
    static navigatorStyle = global.navbarStyle;

    state = {
        tries: 0,
        secretWord: ''
    }

    componentWillMount() {
        routeHelper.handleNavEvent(this.props.navigator, 'secret-word-challenge', this.onNavigatorEvent);
    }

    onNavigatorEvent = (event) => {
        if (event.id == Constants.navEvents.SHOW) {
            Utils.recordScreenView('Secret Word Challenge Screen');
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
        SecuredStorage.clear();
        this.props.navigator.dismissModal();
        this.props.navigator.resetTo({
            title: 'PatientView',
            screen: '/login', // unique ID registered with Navigation.registerScreen
            navigatorButtons: {
                leftButtons: []
            }, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
        });
    }

    confirm = () => {
        this.setState({error: false});
        dismissKeyboard();
        SecuredStorage.checkSecretWord(this.state.secretWord, this.props.enableBiometrics)
            .then((res) => {
                this.props.navigator.dismissModal();
                this.props.onCorrect && this.props.onCorrect(res);
            })
            .catch(e => {
                console.log(e);
                var tries = this.state.tries + 1
                if (e !== 'Incorrect' || tries >= Constants.loginAttempts) {
                    this.props.onFail && this.props.onFail();
                    this.lock();
                    return;
                }
                this.setState({tries, error: true});
            })
    }

    render() {
        const { isLoading, secretWord, error, tries } = this.state;
        return (
            <KeyboardAvoidingView style={{flex: 1}} behavior={ReactNative.Platform.OS == 'ios' ? "padding" : null}
                                  keyboardVerticalOffset={ReactNative.Platform.OS == 'android' ? 64 : 64}>
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
                                onChangeText={(secretWord) => this.setState({secretWord:secretWord.toUpperCase()})}
                            />
                        </Flex>
                    </ScrollView>

                    <FormGroup>
                        {
                            error ?
                                <Fade autostart={true} value={error}>
                                    <View style={Styles.errorContainer}>
                                        <Text style={[Styles.center, {color: 'white'}]}>Incorrect details provided, please try again.</Text>
                                        {tries >= Constants.loginAttempts - 3 ? (
                                            <Text style={[Styles.center, {color: 'white'}]}>{Constants.loginAttempts - tries} {Constants.loginAttempts - tries === 1 ? 'try' : 'tries'} remaining</Text>
                                        ) : null}
                                    </View>
                                </Fade>
                                : null}
                    </FormGroup>



                    <FormGroup>
                        <Button
                            disabled={isLoading || secretWord.length < 7}
                            onPress={this.confirm}>
                            {isLoading ? 'Confirming' : 'Confirm'}
                        </Button>
                    </FormGroup>

                </Container>
            </KeyboardAvoidingView>
        )
    }
};

SecretWordChallengePage.propTypes = {};


module.exports = SecretWordChallengePage;