/**
 * Created by kylejohnson on 28/01/2017.
 */
import React, {Component, PropTypes} from 'react';

import SessionLength from '../../globals/react-native-session-length';

//IMPORTANT Require stores that use the data action
require('../../common/stores/results-store');
require('../../common/stores/result-store');
require('../../common/stores/alert-store');
require('../../common/stores/medicines-store');
require('../../common/stores/messages-store');
require('../../common/stores/stats-store');
require('../../common/stores/media-store');
// require('../../common/stores/message-store');
require('../../common/stores/letters-store');
import DeviceStateStore from '../../common/stores/device-state-store';

const BIOMETRICS_CANCELED = Platform.OS === 'ios' ? 'User canceled the operation.' : 5;
const BIOMETRICS_LOG_OUT = 'Log Out';
const BIOMETRICS_INCORRECT = 'The user name or passphrase you entered is not correct.'; // iOS only
const BIOMETRICS_FAILED = 'Authentication failed.'; // Android only
const BIOMETRICS_LOCKOUT = 7; // Android only
const BIOMETRICS_CANCELED_BY_USER = 10; // Android only
// @TODO error code for below is 9 but it does not mean this in Android's documentation
// therefore we are using the string instead.
const BIOMETRICS_IRISES_NOT_DETECTED = 'Irises weren\'t detected'; // Android only.
const BIOMETRICS_LOCKOUT_PERMANENT = 9; // Android only.

//Check for the last time the user had a session,
// if it's longer than the desired period, show the challenge.
// todo: always show challenge screen if the user opens from force close
global.mustAuthenticateBiometrics = false;

let iOSBiometricAttempts = 0;

const sessionHandler = (time) => {
    if (global.currentScreen && global.currentScreen != 'login' &&
        global.currentScreen != 'secret-word' && global.currentScreen != 'secret-word-challenge' &&
        global.currentScreen != 'set-secret-word') {
        AsyncStorage.getItem("lastlogin", (err, res) => {
            if (res && new Date().valueOf() - parseInt(res) > Project.sessionTimeout) {
                return
            } else if (time > Project.challengeTimeout || time === -1) {
                SecuredStorage.get()
                    .then(({ promptSecretWord, storage, enableBiometrics }) => {
                        if (promptSecretWord) {
                            routeHelper.showSecretWordChallenge(
                                (data) => {
                                    AppActions.data(data);
                                    if (data.user) {
                                        AccountStore.setUserFromLocal(data.user);
                                    }
                                },
                                () => {},
                                enableBiometrics
                            );
                        } else {
                            AppActions.data(storage);
                            if (storage.user) {
                                AccountStore.setUserFromLocal(storage.user);
                            }
                        }
                    })
                    .catch(async err => {
                        const isLockedByBiometrics = await AsyncStorage.getItem('biometricKeychain');
                        if (Platform.OS === 'ios' && isLockedByBiometrics && err.message === BIOMETRICS_INCORRECT) {
                            iOSBiometricAttempts++;
                            if (iOSBiometricAttempts === 2) {
                                Alert.alert('Too many attempts', 'You have attempted to unlock PatientView too many times using biometrics. Please lock and unlock your phone to retry', [
                                    {text: 'Try again', onPress: () => sessionHandler(-1)}
                                ]);
                                iOSBiometricAttempts = 0;
                                return;
                            }
                        }
                        if (Platform.OS === 'ios' ? err.message === (BIOMETRICS_CANCELED || BIOMETRICS_INCORRECT) : (err.code == BIOMETRICS_CANCELED || err.code == BIOMETRICS_CANCELED_BY_USER || err.message == BIOMETRICS_IRISES_NOT_DETECTED)) {
                            Alert.alert('PatientView', 'You must authenticate using your device passcode or biometrics to continue using Patientview', Platform.OS === 'android' ? [
                                {text: 'OK', onPress: () => sessionHandler(-1)}
                            ] : [
                                {text: 'Logout', onPress: () => {
                                    Alert.alert(
                                        'Confirm Logout',
                                        'If you logout you will not receive any mobile notifications that you have subscribed for. Do you wish to continue?',
                                        [
                                            {text: 'Cancel', onPress: () => sessionHandler(-1), style: 'cancel'},
                                            {text: 'OK', onPress: () => routeHelper.logout(global.currentNavigator)},
                                        ],
                                        {cancelable: false}
                                    );
                                }},
                                {text: 'Try again', onPress: () => sessionHandler(-1)}
                            ],
                            {cancelable: false})
                            // Track that we are showing this alert in case user goes to background
                            global.mustAuthenticateBiometrics = true;
                            return;
                        }
                        if (Platform.OS === 'android' && (err.code == BIOMETRICS_LOCKOUT || err.code == BIOMETRICS_LOCKOUT_PERMANENT)) {
                            Alert.alert('Unauthorized', 'Unable to authenticate. You have been logged out.');
                            routeHelper.logout(global.currentNavigator);
                            return;
                        }
                        switch (err.message) {
                            case BIOMETRICS_LOG_OUT:
                                Alert.alert(
                                    'Confirm Logout',
                                    'If you logout you will not receive any mobile notifications that you have subscribed for. Do you wish to continue?',
                                    [
                                        {text: 'Cancel', onPress: () => sessionHandler(-1), style: 'cancel'},
                                        {text: 'OK', onPress: () => routeHelper.logout(global.currentNavigator)},
                                    ],
                                    {cancelable: false}
                                );
                                // Track that we are showing this alert in case user goes to background
                                global.mustAuthenticateBiometrics = true;
                                return;
                            case BIOMETRICS_FAILED:
                            default:
                                console.log(err);
                                Alert.alert('Error', 'Sorry there was a problem accessing your data. Please log in again.');
                                break;
                        }
                        routeHelper.logout(global.currentNavigator);
                    })
            }
        })
    }
}
SessionLength(sessionHandler);

if (Platform.OS === 'android') {
    var appState = AppState.currentState;
    AppState.addEventListener('change', (nextAppState) => {
        if (
            appState.match(/inactive|background/) &&
            nextAppState === 'active' && global.mustAuthenticateBiometrics
        ) {
            global.mustAuthenticateBiometrics = false;
            sessionHandler(-1);
        }
        appState = nextAppState;
    });
}

const LoginPage = class extends Component {
        static navigatorStyle = global.navbarStyle;

        displayName: 'LoginPage';

        constructor(props, context) {
            super(props, context);
            this.state = {
                terms: false,
                isLoading: true
            };
            ES6Component(this);
        }

        async componentDidMount() {
            routeHelper.handleNavEvent(this.props.navigator, 'login', this.onNavigatorEvent);

            try {
                const appVersion = await AsyncStorage.getItem("appVersion");
                const lastLogin = await AsyncStorage.getItem("lastlogin");
                if (!appVersion || parseInt(appVersion) !== Project.appVersion) {
                    AsyncStorage.setItem('appVersion', Project.appVersion.toString());
                    if (lastLogin) {
                        Alert.alert('Alert', 'App security has changed. You will need to log in again.');
                    }
                    throw new Error("Incompatible app version. Enforce log out");
                }

                if (lastLogin && new Date().valueOf() - parseInt(lastLogin) < Project.sessionTimeout) {
                    this.getSecuredStorage();
                } else {
                    if (lastLogin) {
                        Alert.alert('Session Timeout', 'Your session has timed out. You will need to log in again.');
                        throw new Error('Session timeout');
                    }
                    this.setState({isLoading: false});
                }
            } catch (e) {
                console.log(e);
                this.setState({isLoading: false});
                AppActions.logout();
            }

            if (Platform.OS === 'android') {
                this.listenTo(DeviceStateStore, 'change', () => {
                    if (DeviceStateStore.getIsActive() && this.state.alertMustAuthenticate) {
                        Alert.alert('PatientView', 'You must authenticate using your device passcode or biometrics to continue using Patientview', [
                            {text: 'OK', onPress: () => {
                                this.setState({alertMustAuthenticate: false});
                                this.getSecuredStorage();
                            }}
                        ],
                        {cancelable: false});
                    }
                })
            }
        }

        getSecuredStorage = () => {
            SecuredStorage.get()
                .then(({ promptSecretWord, storage, enableBiometrics }) => {
                    if (promptSecretWord) {
                        routeHelper.showSecretWordChallenge(
                            (data) => {
                                AppActions.data(data);
                                if (data.user) {
                                    AccountStore.setUserFromLocal(data.user);
                                    routeHelper.goAccount(this.props.navigator)
                                } else {
                                    this.setState({isLoading: false});
                                }
                            },
                            () => {
                                this.setState({isLoading: false});
                            },
                            enableBiometrics
                        );
                    } else {
                        AppActions.data(storage);
                        if (storage.user) {
                            AccountStore.setUserFromLocal(storage.user);
                            routeHelper.goAccount(this.props.navigator);
                        } else {
                            this.setState({isLoading: false});
                        }
                    }
                })
                .catch(async err => {
                    const isLockedByBiometrics = await AsyncStorage.getItem('biometricKeychain');
                    if (Platform.OS === 'ios' && isLockedByBiometrics && err.message === BIOMETRICS_INCORRECT) {
                        iOSBiometricAttempts++;
                        if (iOSBiometricAttempts === 5) {
                            Alert.alert('Too many attempts', 'You have attempted to unlock PatientView too many times using biometrics. Please lock and unlock your phone to retry', [
                                {text: 'Try again', onPress: () => {
                                    this.setState({alertMustAuthenticate: false});
                                    this.getSecuredStorage();
                                }}
                            ]);
                            iOSBiometricAttempts = 0;
                            return;
                        }
                    }
                    if (Platform.OS === 'ios' ? err.message === BIOMETRICS_CANCELED || BIOMETRICS_INCORRECT : (err.code == BIOMETRICS_CANCELED || err.code == BIOMETRICS_CANCELED_BY_USER || err.message == BIOMETRICS_IRISES_NOT_DETECTED)) {
                        Alert.alert('PatientView', 'You must authenticate using your device passcode or biometrics to continue using Patientview', Platform.OS === 'android' ? [
                            {text: 'OK', onPress: () => {
                                this.setState({alertMustAuthenticate: false});
                                this.getSecuredStorage();
                            }}
                        ] : [
                            {text: 'Log Out', onPress: this.showLogoutAlert},
                            {text: 'Try Again', onPress: () => {
                                this.setState({alertMustAuthenticate: false});
                                this.getSecuredStorage();
                            }}
                        ],
                        {cancelable: false})
                        // Track that we are showing this alert in case user goes to background
                        this.setState({alertMustAuthenticate: true});
                        return;
                    }
                    if (Platform.OS === 'android' && (err.code == BIOMETRICS_LOCKOUT || err.code == BIOMETRICS_LOCKOUT_PERMANENT)) {
                        Alert.alert('Unauthorized', 'Unable to authenticate. You have been logged out.');
                        this.setState({isLoading: false});
                        AppActions.logout();
                        return;
                    }
                    switch (err.message) {
                        case BIOMETRICS_LOG_OUT:
                            this.showLogoutAlert();
                            // Track that we are showing this alert in case user goes to background
                            this.setState({alertMustAuthenticate: true});
                            return;
                        case BIOMETRICS_FAILED:
                        default:
                            console.log(err.code, err.message);
                            Alert.alert('Error', 'Sorry there was a problem accessing your data. Please log in again.');
                            break;
                    }
                    this.setState({isLoading: false});
                    AppActions.logout();
                })
        }

        showLogoutAlert = () => {
            Alert.alert(
                'Confirm Logout',
                'If you logout you will not receive any mobile notifications that you have subscribed for. Do you wish to continue?',
                [
                    {text: 'Cancel', onPress: () => {
                        this.setState({alertMustAuthenticate: false});
                        this.getSecuredStorage();
                    }, style: 'cancel'},
                    {text: 'OK', onPress: () => {
                        this.setState({isLoading: false, alertMustAuthenticate: false});
                        AppActions.logout();
                    }},
                ],
                {cancelable: false}
            );
        }

        onNavigatorEvent = (event) => {
            if (event.id == Constants.navEvents.SHOW) {
                Utils.recordScreenView('Login Screen');
                this.props.navigator.setDrawerEnabled({
                    side: 'right', // the side of the drawer since you can have two, 'left' / 'right'
                    enabled: false // should the drawer be enabled or disabled (locked closed)
                });
            } else if (event.id == Constants.navEvents.HIDE) {

            }
        };

        onLogin = () => {
            if (global.currentScreen == 'login') {
                if (this.props.onLogin) {
                    this.props.onLogin(this.props.navigator);
                } else if (!AccountStore.getUser()) {
                    this.props.navigator.resetTo({
                        backButtonHidden: true,
                        screen: "/secret-word",
                        title: "Enter your Secret Word",
                        passProps: {
                            onLogin: () => {
                                routeHelper.goAccount(this.props.navigator);
                            }
                        }
                    })
                } else {
                    routeHelper.goAccount(this.props.navigator);
                }

            }
        };

        renderAndroid() {
            const footer = (
                <View>
                    <FormGroup>
                        <Row>
                            <TouchableOpacity
                                style={{
                                    width: (DeviceWidth / 2) - 10,
                                    alignItems: 'flex-start'
                                }}
                                onPress={() => routeHelper.openWebModal(this.props.navigator, "https://www.patientview.org/#/request", "Join PatientView")}>
                                <Text style={Styles.anchor}>
                                    Join PatientView
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    width: (DeviceWidth / 2) - 10,
                                    alignItems: 'flex-end'
                                }}
                                onPress={() => routeHelper.openWebModal(this.props.navigator, "https://www.patientview.org/#/forgottenpassword", "Forgot Password")}>
                                <Text style={Styles.anchor}>
                                    Forgotten your login?
                                </Text>
                            </TouchableOpacity>
                        </Row>
                    </FormGroup>
                    <FormGroup>
                        <Text style={[Styles.center,Styles.fontSizeSmall]}>
                            This mobile app is in evolution so some data won't be displayed yet,
                            you can
                            also
                            <Text
                                onPress={() => routeHelper.openWebModal(this.props.navigator, "https://patientview.org", "PatientView")}
                                style={[{color: pallette.primary},Styles.fontSizeSmall]}> login to the website</Text> to
                            see all PatientView functions.
                        </Text>
                    </FormGroup>
                    <FormGroup>
                        <Row style={{justifyContent: 'center'}}>
                            <Column>
                                <Button style={{backgroundColor: colour.facebook, flexDirection: 'row'}}
                                        onPress={() => {
                                            Linking.openURL("fb://profile/1599800243626308")
                                                .catch(() => {
                                                    routeHelper.openWebModal(this.props.navigator, "https://www.facebook.com/patientview", "PatientView Facebook")
                                                })
                                        }}>

                                    <ION style={{fontSize: em(3)}} color="white" name="logo-facebook"/>
                                    <Text style={{color: '#fff', marginLeft: 10}}>Like us on Facebook</Text>
                                </Button>
                            </Column>
                        </Row>
                    </FormGroup>
                    <FormGroup/>
                    <Row style={Styles.paddedContainer}>
                        <Flex>
                            <TouchableOpacity
                                onPress={() => routeHelper.openWebModal(this.props.navigator, "https://patientview.org/#/privacy", "Privacy Policy")}>
                                <Text style={[Styles.anchor, Styles.fontSizeSmall, {textAlign: 'right'}]}>
                                    Privacy Policy
                                </Text>
                            </TouchableOpacity>
                        </Flex>
                        <Flex style={{alignItems: 'center'}}>
                            <TouchableOpacity
                                onPress={() => routeHelper.openWebModal(this.props.navigator, "https://www.patientview.org/#/terms", "Terms and Conditions")}>
                                <Text style={[Styles.anchor, Styles.fontSizeSmall]}>
                                    Terms & Conditions
                                </Text>
                            </TouchableOpacity>
                        </Flex>
                        <Flex>
                            <Text style={[Styles.fontSizeSmall, {textAlign: 'left'}]}>
                                PatientView {new Date().getFullYear()} ©
                            </Text>
                        </Flex>
                    </Row>
                </View>
            )
            return (
                <KeyboardAvoidingView contentContainerStyle={{height:DeviceHeight, width:DeviceWidth}}
                                      keyboardVerticalOffset={ReactNative.Platform.OS == 'android' ? -180 : -60}
                                      behavior={ReactNative.Platform.OS == 'android' ? "position" : "padding"}>
                    <NetworkBar message="It seems you are offline, you need to be online to login."/>
                    <KeyboardAwareScrollView style={{flex:1}} contentContainerStyle={{flex:1,backgroundColor:"white"}}>
                        <LoginProvider onLogin={this.onLogin}>
                            {(user, {isLoading, error, username, password}, {setUsername, setPassword, login}) => (
                                <Container style={{flex:1}}>
                                    <Flex>
                                        <Flex>
                                            <Image
                                                style={Styles.leadGraphic}
                                                resizeMode='contain'
                                                source={require('../../images/patientview.png')}
                                            />
                                            <Row>
                                                <Text style={Styles.center}>
                                                    PatientView shows your latest test results, letters and medicines,
                                                    info
                                                    about diagnosis and treatment, and much more.
                                                    <Text
                                                        onPress={() => routeHelper.openWebModal(this.props.navigator, "http://rixg.org/patientview2/about/", "About PatientView")}
                                                        style={{color: pallette.primary}}> Find out more about the
                                                        system
                                                        here</Text>

                                                </Text>
                                                <Text style={[Styles.center]}>
                                                </Text>
                                            </Row>
                                            <FormGroup>
                                                {
                                                    error ?
                                                        <Text style={[Styles.center, Styles.error]}>{error}</Text> : null
                                                }
                                            </FormGroup>
                                            <FormGroup>
                                                <FormGroup>
                                                    <TextInput
                                                        autoCorrect={false}
                                                        placeholder="Username"
                                                        value={username}
                                                        onChangeText={setUsername}
                                                        autoCapitalize="none"
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <TextInput
                                                        placeholder="Password"
                                                        secureTextEntry={true}
                                                        value={password}
                                                        onChangeText={setPassword}
                                                    />
                                                </FormGroup>
                                            </FormGroup>


                                            <FormGroup>
                                                <TouchableOpacity
                                                    activeOpacity={0.8}
                                                    onPress={() => this.setState({terms: !this.state.terms})}
                                                    style={this.state.terms ? Styles.alertSuccess : Styles.alertWarn}>
                                                    <Row>
                                                        <View style={{
                                                            alignItems: 'center',
                                                            borderWidth: 2,
                                                            borderRadius: 2,
                                                            borderColor: !this.state.terms ? "#ccc" : "transparent",
                                                            backgroundColor: !this.state.terms ? "#fff" : colour.primary,
                                                            width: em(1.8) + 4,
                                                            height: em(1.8) + 4
                                                        }}>
                                                            <ION style={{
                                                                backgroundColor: 'transparent',
                                                                fontSize: em(1.8),
                                                                color: !this.state.terms ? "#fff" : "#fff"
                                                            }}
                                                                 name={"md-checkmark"}/>
                                                        </View>
                                                        <Flex>
                                                            <Column>
                                                                <Text>
                                                                    By ticking this box you agree to download your clinical
                                                                    data to this device. This will enable login.
                                                                </Text>
                                                            </Column>
                                                        </Flex>
                                                    </Row>
                                                </TouchableOpacity>
                                            </FormGroup>

                                            <FormGroup>
                                                <Button disabled={isLoading || !username || !password || !this.state.terms}
                                                        onPress={login}>
                                                    {isLoading ? 'Logging In' : 'Login'}
                                                </Button>
                                            </FormGroup>

                                            {footer}
                                        </Flex>
                                    </Flex>
                                </Container>
                            )}
                        </LoginProvider>
                    </KeyboardAwareScrollView>
                </KeyboardAvoidingView>
            )
        }

        render() {
            if (this.state.isLoading) return <Flex style={Styles.centeredContainer}><Loader/></Flex>
            if (Platform.OS === 'android') return this.renderAndroid();
            const footer = (
                <View>
                    <FormGroup>
                        <Row style={{justifyContent: 'center'}}>
                            <Column>
                                <Button style={{backgroundColor: colour.facebook, flexDirection: 'row'}}
                                        onPress={() => {
                                            Linking.openURL("fb://profile/1599800243626308")
                                                .catch(() => {
                                                    routeHelper.openWebModal(this.props.navigator, "https://www.facebook.com/patientview", "PatientView Facebook")
                                                })
                                        }}>

                                    <ION style={{fontSize: em(3)}} color="white" name="logo-facebook"/>
                                    <Text style={{color: '#fff', marginLeft: 10}}>Like us on Facebook</Text>
                                </Button>
                            </Column>
                        </Row>
                    </FormGroup>
                    <FormGroup/>
                    <Row style={Styles.paddedContainer}>
                        <Flex>
                            <TouchableOpacity
                                onPress={() => routeHelper.openWebModal(this.props.navigator, "https://patientview.org/#/privacy", "Privacy Policy")}>
                                <Text style={[Styles.anchor, Styles.fontSizeSmall, {textAlign: 'right'}]}>
                                    Privacy Policy
                                </Text>
                            </TouchableOpacity>
                        </Flex>
                        <Flex style={{alignItems: 'center'}}>
                            <TouchableOpacity
                                onPress={() => routeHelper.openWebModal(this.props.navigator, "https://www.patientview.org/#/terms", "Terms and Conditions")}>
                                <Text style={[Styles.anchor, Styles.fontSizeSmall]}>
                                    Terms & Conditions
                                </Text>
                            </TouchableOpacity>
                        </Flex>
                        <Flex>
                            <Text style={[Styles.fontSizeSmall, {textAlign: 'left'}]}>
                                PatientView {new Date().getFullYear()} ©
                            </Text>
                        </Flex>
                    </Row>
                </View>
            )
            const smallDevice = DeviceHeight <= 480;
            return (
                <KeyboardAvoidingView style={{flex: 1}}
                                      behavior={ReactNative.Platform.OS == 'android' ? "position" : "padding"}
                                      keyboardVerticalOffset={ReactNative.Platform.OS == 'android' ? -100 : -60}>
                    <NetworkBar message="It seems you are offline, you need to be online to login."/>
                    <KeyboardAwareScrollView extraHeight={Dimensions.get("window").width <= 320 ? 210 : 180}>
                        <LoginProvider onLogin={this.onLogin}>
                            {(user, {isLoading, error, username, password}, {setUsername, setPassword, login}) => (
                                <Container style={[Styles.body]}>
                                    <Flex>
                                        <Flex>
                                            <Image
                                                style={Styles.leadGraphic}
                                                resizeMode='contain'
                                                source={require('../../images/patientview.png')}
                                            />
                                            <Row>
                                                <Text style={Styles.center}>
                                                    PatientView shows your latest test results, letters and medicines,
                                                    info
                                                    about diagnosis and treatment, and much more.
                                                    <Text
                                                        onPress={() => routeHelper.openWebModal(this.props.navigator, "http://rixg.org/patientview2/about/", "About PatientView")}
                                                        style={{color: pallette.primary}}> Find out more about the
                                                        system
                                                        here</Text>

                                                </Text>
                                                <Text style={[Styles.center]}>
                                                </Text>
                                            </Row>
                                            <FormGroup>
                                                {
                                                    error ?
                                                        <Text style={[Styles.center, Styles.error]}>{error}</Text> : null
                                                }
                                            </FormGroup>
                                            <FormGroup>
                                                <FormGroup>
                                                    <TextInput
                                                        autoCorrect={false}
                                                        placeholder="Username"
                                                        value={username}
                                                        onChangeText={setUsername}
                                                        autoCapitalize="none"
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <TextInput
                                                        placeholder="Password"
                                                        secureTextEntry={true}
                                                        value={password}
                                                        onChangeText={setPassword}
                                                    />
                                                </FormGroup>
                                            </FormGroup>


                                            <FormGroup>
                                                <TouchableOpacity
                                                    activeOpacity={0.8}
                                                    onPress={() => this.setState({terms: !this.state.terms})}
                                                    style={this.state.terms ? Styles.alertSuccess : Styles.alertWarn}>
                                                    <Row>
                                                        <View style={{
                                                            alignItems: 'center',
                                                            borderWidth: 2,
                                                            borderRadius: 2,
                                                            borderColor: !this.state.terms ? "#ccc" : "transparent",
                                                            backgroundColor: !this.state.terms ? "#fff" : colour.primary,
                                                            width: em(1.8) + 4,
                                                            height: em(1.8) + 4
                                                        }}>
                                                            <ION style={{
                                                                backgroundColor: 'transparent',
                                                                fontSize: em(1.8),
                                                                color: !this.state.terms ? "#fff" : "#fff"
                                                            }}
                                                                 name={"md-checkmark"}/>
                                                        </View>
                                                        <Flex>
                                                            <Column>
                                                                <Text>
                                                                    By ticking this box you agree to download your clinical
                                                                    data to this device. This will enable login.
                                                                </Text>
                                                            </Column>
                                                        </Flex>
                                                    </Row>
                                                </TouchableOpacity>
                                            </FormGroup>

                                            <FormGroup>
                                                <Button disabled={isLoading || !username || !password || !this.state.terms}
                                                        onPress={login}>
                                                    {isLoading ? 'Logging In' : 'Login'}
                                                </Button>
                                            </FormGroup>

                                            <FormGroup>
                                                <Row>
                                                    <TouchableOpacity
                                                        style={{
                                                            width: (DeviceWidth / 2) - 10,
                                                            alignItems: 'flex-start'
                                                        }}
                                                        onPress={() => routeHelper.openWebModal(this.props.navigator, "https://www.patientview.org/#/request", "Join PatientView")}>
                                                        <Text style={Styles.anchor}>
                                                            Join PatientView
                                                        </Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={{
                                                            width: (DeviceWidth / 2) - 10,
                                                            alignItems: 'flex-end'
                                                        }}
                                                        onPress={() => routeHelper.openWebModal(this.props.navigator, "https://www.patientview.org/#/forgottenpassword", "Forgot Password")}>
                                                        <Text style={Styles.anchor}>
                                                            Forgotten your login?
                                                        </Text>
                                                    </TouchableOpacity>
                                                </Row>
                                            </FormGroup>
                                            <FormGroup>
                                                <Text style={[Styles.center, Styles.fontSizeSmall]}>
                                                    This mobile app is in evolution so some data won't be displayed yet,
                                                    you can
                                                    also
                                                    <Text
                                                        onPress={() => routeHelper.openWebModal(this.props.navigator, "https://patientview.org", "PatientView")}
                                                        style={[{color: pallette.primary}, Styles.fontSizeSmall]}> login to
                                                        the website</Text> to
                                                    see all PatientView functions.
                                                </Text>
                                            </FormGroup>
                                        </Flex>
                                        {smallDevice && footer}
                                    </Flex>

                                </Container>
                            )}
                        </LoginProvider>
                    </KeyboardAwareScrollView>
                    {!smallDevice && footer}
                </KeyboardAvoidingView>
            )
        }
    }
;

LoginPage.propTypes = {};


module.exports = LoginPage;
