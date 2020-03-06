import React, {Component, PropTypes} from 'react';
import { InputAccessoryView } from 'react-native';
import DatePicker from 'react-native-datepicker';

const Hospitalisation = class extends Component {
    static displayName = 'Hospitalisation';
    static navigatorStyle = global.navbarStyle;

    constructor(props, context) {
        super(props, context);
        const { entry } = this.props;
        this.state = {
            ...entry,
            edit: !!entry,
            showDischargedDate: entry && entry.dateDischarged,
            dateAdmitted: entry ? entry.dateAdmitted : null,
            dateDischarged: entry ? entry.dateDischarged : moment().startOf('day').valueOf(),
        };
        ES6Component(this)
    }

    componentWillMount() {
        this.listenTo(HospitalisationsStore, "saved", () => {
            this.props.navigator.pop();
        });
        this.listenTo(HospitalisationsStore, "change", () => {
            this.setState({
                saving: HospitalisationsStore.isSaving
            });
        });
        this.listenTo(HospitalisationsStore, 'problem', () => {
            Alert.alert('Error', HospitalisationsStore.error);
        })
        routeHelper.handleNavEvent(this.props.navigator, 'message', this.onNavigatorEvent);
    }

    setHospitalisationDate = (date) => this.setState({dateAdmitted: moment(date, 'DD-MM-YYYY').valueOf()});

    setReason = (reason) => this.setState({reason});

    setDischargedDate = (date) => this.setState({dateDischarged: moment(date, 'DD-MM-YYYY').valueOf()});

    showDischargedDate = () => this.setState({showDischargedDate: !this.state.showDischargedDate});

    save = () => {
        const { edit, id, dateAdmitted, reason, dateDischarged, showDischargedDate } = this.state;
        const hospitalisation = {
            dateAdmitted,
            reason: reason || '',
            dateDischarged: showDischargedDate ? dateDischarged : null,
        }
        if (edit) {
            AppActions.updateINSHospitalisation(id, hospitalisation);
        } else {
            AppActions.saveINSHospitalisation(hospitalisation);
        }
    };

    onNavigatorEvent = (event) => {
        if (event.id == Constants.navEvents.SHOW) {
            Utils.recordScreenView('INS Hospitalisation Screen');
        }
        if (event.id == 'close') {
            this.props.navigator.dismissModal();
        }
    };

    render() {
        const {
            edit, dateAdmitted, reason, dateDischarged, showDischargedDate
        } = this.state;
        const { entry } = this.props;
        const reasonInputAccessoryViewID = "reasonInput";
        return (
            <Flex>
                <NetworkProvider>
                    {(isConnected) => (
                        <Flex style={Styles.whiteContainer}>
                            <NetworkBar
                                message="It seems you are offline, you need to be online to record a hospitalisation."/>

                            <Flex>
                                <Container style={{flex: 1}}>
                                    <KeyboardAwareScrollView keyboardShouldPersistTaps={"handled"} style={{flex: 1}}>
                                        <FormGroup>
                                            <Column>
                                                <Text style={Styles.label}>Hospitalisation Date</Text>
                                                <DatePicker
                                                    style={{alignSelf: "stretch", width: "100%", height: 54,}}
                                                    date={dateAdmitted ? moment(dateAdmitted) : null}
                                                    mode="date"
                                                    maxDate={moment()}
                                                    placeholder="Tap to select date"
                                                    format="DD-MM-YYYY"
                                                    confirmBtnText="Confirm"
                                                    cancelBtnText="Cancel"
                                                    customStyles={{
                                                        dateInput: [Styles.inputContainer, {
                                                            alignItems: "flex-start",
                                                            paddingLeft: 10,
                                                            height: 44,
                                                            alignSelf: "stretch"
                                                        }]
                                                        // ... You can check the source to find the other keys.
                                                    }}
                                                    onDateChange={this.setHospitalisationDate}
                                                />
                                            </Column>
                                        </FormGroup>

                                        <FormGroup>
                                            <Column>
                                                <Text style={Styles.label}>Reason</Text>
                                                <TextInput
                                                    value={reason || ''}
                                                    onChangeText={this.setReason}
                                                    multiline
                                                    height={200}
                                                    inputAccessoryViewID={reasonInputAccessoryViewID}
                                                    ref={c => this.reasonInput = c}
                                                />
                                                {Platform.OS === 'ios' && (
                                                    <InputAccessoryView nativeID={reasonInputAccessoryViewID}>
                                                        <Flex style={Styles.inputAccessoryViewContainer}>
                                                            <Text style={Styles.inputAccessoryViewDone} onPress={() => this.reasonInput.blur()}>Done</Text>
                                                        </Flex>
                                                    </InputAccessoryView>
                                                )}
                                            </Column>
                                        </FormGroup>

                                        <FormGroup>
                                            <Column>
                                                <Text style={Styles.label}>Discharge Date</Text>
                                                {!showDischargedDate ? (
                                                    <Row>
                                                        <Text style={[Styles.italic, Styles.bold]}>Ongoing</Text>
                                                        <Button style={Styles.ml10} onPress={this.showDischargedDate}>Enter Date</Button>
                                                    </Row>
                                                ) : (
                                                    <Row>
                                                        <Flex>
                                                            <DatePicker
                                                                style={{alignSelf: "stretch", width: "100%", height: 54,}}
                                                                date={dateDischarged ? moment(dateDischarged) : null}
                                                                mode="date"
                                                                maxDate={moment()}
                                                                placeholder="Tap to select date"
                                                                format="DD-MM-YYYY"
                                                                confirmBtnText="Confirm"
                                                                cancelBtnText="Cancel"
                                                                customStyles={{
                                                                    dateInput: [Styles.inputContainer, {
                                                                        alignItems: "flex-start",
                                                                        paddingLeft: 10,
                                                                        height: 44,
                                                                        alignSelf: "stretch"
                                                                    }]
                                                                    // ... You can check the source to find the other keys.
                                                                }}
                                                                onDateChange={this.setDischargedDate}
                                                            />
                                                        </Flex>
                                                        <Button style={[Styles.ml10, {marginBottom: 8}]} onPress={this.showDischargedDate}>Ongoing?</Button>
                                                    </Row>
                                                )}
                                            </Column>
                                        </FormGroup>
                                        
                                        <FormGroup style={[Styles.mt10, Styles.mb10]}>
                                            <Column>
                                                <Button onPress={() => this.save(false)}
                                                        disabled={!isConnected || this.state.saving || !reason || !dateAdmitted}>
                                                    {this.state.saving ? "Saving..." : "Save"}
                                                </Button>
                                            </Column>
                                        </FormGroup>

                                    </KeyboardAwareScrollView>
                                </Container>
                            </Flex>
                        </Flex>
                    )}
                </NetworkProvider>
            </Flex>
        )
    }
};

Hospitalisation.propTypes = {};

module.exports = Hospitalisation;