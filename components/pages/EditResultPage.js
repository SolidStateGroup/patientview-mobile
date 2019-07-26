import React, {Component, PropTypes} from 'react';
import DatePicker from 'react-native-datepicker'

const EditResultPage = class extends Component {
    displayName: 'EditResultPage'
    static navigatorStyle = global.navbarStyle;

    constructor(props, context) {
        super(props, context);
        const {result} = this.props;
        this.state = {...result};
        ES6Component(this)
    }

    componentWillMount() {
        this.listenTo(EditResultsStore, "saved", () => {
            this.props.navigator.dismissModal();
        });
        this.listenTo(EditResultsStore, "change", () => {
            this.setState({
                saving: EditResultsStore.isSaving
            });
        });
        routeHelper.handleNavEvent(this.props.navigator, 'message', this.onNavigatorEvent);

        AppActions.getEditResults();
    }

    save = () => {
        AppActions.editResult(this.state)
    };


    onNavigatorEvent = (event) => {
        if (event.id == Constants.navEvents.SHOW) {
            Utils.recordScreenView('Edit Results Screen ' + this.props.result.name);
        }
        if (event.id == 'close') {
            this.props.navigator.dismissModal();
        }
    };

    render() {
        return (
            <KeyboardAvoidingView style={{flex: 1}} behavior={"padding"}
                                  keyboardVerticalOffset={ReactNative.Platform.OS == 'android' ? -260 : 64}>
                <NetworkProvider>
                    {(isConnected) => (
                        <Flex style={Styles.whiteContainer}>
                            <NetworkBar
                                message="It seems you are offline, you need to be online to enter your own data."/>
                            <FormGroup>
                                <Column>
                                    <DatePicker
                                        style={{alignSelf: "stretch", width: "100%", height: 54,}}
                                        date={moment(this.state.applies)}
                                        mode="datetime"
                                        maxDate={moment()}
                                        placeholder="select date"
                                        format="DD-MMM-YYYY HH:mm"
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        customStyles={{
                                            dateIcon: {
                                                position: 'absolute',
                                                width: 0
                                            },
                                            dateInput: [Styles.inputContainer, {
                                                alignItems: "flex-start",
                                                paddingLeft: 10,
                                                height: 44,
                                                alignSelf: "stretch"
                                            }]
                                            // ... You can check the source to find the other keys.
                                        }}
                                        onDateChange={(applies) => {
                                            this.setState({applies})
                                        }}
                                    />
                                </Column>
                            </FormGroup>
                            <FormGroup>
                                <Column>
                                    <TextInput
                                        value={this.state.value}
                                        onChangeText={(value) => this.setState({value})}
                                    />
                                </Column>
                            </FormGroup>


                            <FormGroup style={{marginBottom: 10}}>
                                <Column>
                                    <Button onPress={() => this.save(false)}
                                            disabled={!isConnected || this.state.saving || this.state.value == ""}>
                                        {this.state.saving ? "Saving..." : "Save"}
                                    </Button>
                                </Column>
                            </FormGroup>
                        </Flex>
                    )}
                </NetworkProvider>
            </KeyboardAvoidingView>
        )
    }
};

EditResultPage.propTypes = {};

module.exports = EditResultPage;