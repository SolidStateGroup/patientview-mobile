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
            email: AccountStore.getEmail() + "",
            confirmEmail: AccountStore.getEmail() + "",
            contactNumber: AccountStore.getContactNumber() + "",
        };
        ES6Component(this);
    }

    componentWillMount() {
        routeHelper.handleNavEvent(this.props.navigator, 'contact-settings', this.onNavigatorEvent);

        this.listenTo(AccountStore, 'change', () => {
            this.setState({ isSaving: AccountStore.isSaving, error: AccountStore.error });
        });
        this.listenTo(AccountStore, 'settings-saved', () => {
            this.setState({ hasSaved: true });
        });

    }

    onNavigatorEvent = (event) => {
        if (event.id == Constants.navEvents.SHOW) {
            Utils.recordScreenView('About Screen');
        } else if (event.id == 'close') {
            this.props.navigator.dismissModal();
        }
    };

    submit = () => {
        const { email, confirmEmail, contactNumber } = this.state;
        this.setState({ hasSaved: false, isSaving: true });
        AppActions.updateSettings({ email, confirmEmail, contactNumber })
    };

    calculateExtraHeight = (e) => {
        this.setState({
            extraHeight: e.nativeEvent.layout.height + 120
        })
    }

    render() {
        const { email, confirmEmail, contactNumber, hasSaved } = this.state;
        const isValid = Utils.validEmail(email) && (email == confirmEmail);
        return (
            <KeyboardAvoidingView style={[Styles.body, { flex: 1 }]} behavior="padding"
                                  keyboardVerticalOffset={ReactNative.Platform.OS == 'android' ? -270 : 70}>
                <NetworkBar message="It seems you are offline, you need to be online to update contact details."/>
                <Container style={[Styles.body, { flex: 1 }]}>
                    <Flex>
                        <KeyboardAwareScrollView extraScrollHeight={ReactNative.Platform.OS == 'ios' ? -40:0}>
                            <FormGroup>
                                <Text onLayout={this.calculateExtraHeight} style={Styles.center}>
                                    Confirm your email address by entering the email you wish to use in both boxes
                                    below.
                                    {'\n\n'}
                                    Please note that the information below does not automatically update the records in
                                    your unit, though it does update your PatientView Account.
                                </Text>
                            </FormGroup>
                            <FormGroup>
                                <TextInput
                                    placeholder="Email"
                                    value={email}
                                    onChangeText={(email) => this.setState({ email })}
                                />
                            </FormGroup>
                            <FormGroup>
                                <TextInput
                                    placeholder="Confirm Email"
                                    value={confirmEmail}
                                    onChangeText={(confirmEmail) => this.setState({ confirmEmail })}
                                />
                            </FormGroup>
                            <FormGroup>
                                <TextInput
                                    placeholder="Contact Number"
                                    value={contactNumber}
                                    onChangeText={(contactNumber) => this.setState({ contactNumber })}
                                />
                            </FormGroup>
                        </KeyboardAwareScrollView>
                    </Flex>

                    {hasSaved && (
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
                    )}


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