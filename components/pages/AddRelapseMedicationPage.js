import React, {Component, PropTypes} from 'react';
import DatePicker from 'react-native-datepicker';
import TagInput from 'react-native-tag-input';

const AddRelapseMedication = class extends Component {
    static displayName = 'AddRelapseMedication';

    static navigatorStyle = global.navbarStyle;

    constructor(props, context) {
        super(props, context);
        this.state = {};
        ES6Component(this)
    }

    componentWillMount() {
        routeHelper.handleNavEvent(this.props.navigator, 'message', this.onNavigatorEvent);
    }

    onNavigatorEvent = (event) => {
        if (event.id == Constants.navEvents.SHOW) {
            Utils.recordScreenView('Add Relapse Medication Screen');
        }
        if (event.id == 'close') {
            this.props.navigator.dismissModal();
        }
    };

    showOptions = (key, title, options) => {
        API.showOptions(title, _.flatMap(options), true)
            .then((i)=> {
                if (i < Object.keys(options).length)
                    this.setState({[key]: Object.keys(options)[i]})
            })
    }

    showMedicationOptions = () => this.showOptions('name', 'Medication', Constants.relapseMedication);

    showUnitsOptions = () => this.showOptions('doseUnits', 'Units', Constants.relapseMedicationUnits);

    showFrequencyOptions = () => this.showOptions('doseFrequency', 'Frequency', Constants.relapseMedicationFrequency);

    showRouteOptions = () => this.showOptions('route', 'Route', Constants.relapseMedicationRoutes);

    setDoseQuantity = (value) => this.setState({doseQuantity: value ? value.match(/^\d+$/g) ? value : this.state.doseQuantity : ''});

    setDateStarted = (date) => this.setState({started: moment(date, 'DD-MM-YYYY').valueOf()});

    setDateStopped = (date) => this.setState({stopped: moment(date, 'DD-MM-YYYY').valueOf()});

    setOtherMedication = (other) => this.setState({other});

    isValid = () => {
        const {
            name, other,
        } = this.state;
        if (!name) return false;
        if (name === 'OTHER' && !other) return false;
        return true;
    }

    render() {
        const {
            name, doseQuantity, doseUnits, doseFrequency, route, started, stopped, other,
        } = this.state;
        return (
            <Flex>
                <NetworkProvider>
                    {(isConnected) => (
                        <Flex style={Styles.whiteContainer}>
                            <NetworkBar
                                message="It seems you are offline, you need to be online to enter your own data."/>

                            <Flex>
                                <Container style={{flex: 1}}>
                                    <KeyboardAwareScrollView keyboardShouldPersistTaps={"handled"} style={{flex: 1}}>
                                        <FormGroup>
                                            <Column>
                                                <Text style={Styles.label}>Medication</Text>
                                                <SelectBox onPress={this.showMedicationOptions} style={{width: 150}}>
                                                    {name ? Constants.relapseMedication[name] : ''}
                                                </SelectBox>
                                            </Column>
                                        </FormGroup>

                                        {name === 'OTHER' && (
                                            <FormGroup>
                                                <Column>
                                                    <Text style={Styles.label}>Medication Name</Text>
                                                    <TextInput
                                                        value={other}
                                                        onChangeText={this.setOtherMedication}
                                                        maxLength={100}
                                                        placeholder="Please Specify"
                                                    />
                                                </Column>
                                            </FormGroup>
                                        )}

                                        <Row>
                                            <Flex>
                                                <FormGroup>
                                                    <Column>
                                                        <Text style={Styles.label}>Dose Qty.</Text>
                                                        <TextInput
                                                            value={doseQuantity}
                                                            keyboardType={"numeric"}
                                                            onChangeText={this.setDoseQuantity}
                                                        />
                                                    </Column>
                                                </FormGroup>
                                            </Flex>
                                            <Flex>
                                                <FormGroup>
                                                    <Column>
                                                        <Text style={Styles.label}>Units</Text>
                                                        <SelectBox onPress={this.showUnitsOptions} style={{width: 150}}>
                                                            {doseUnits ? Constants.relapseMedicationUnits[doseUnits] : ''}
                                                        </SelectBox>
                                                    </Column>
                                                </FormGroup>
                                            </Flex>
                                        </Row>

                                        <Row>
                                            <Flex>
                                                <FormGroup>
                                                    <Column>
                                                        <Text style={Styles.label}>Dose Frequency</Text>
                                                        <SelectBox onPress={this.showFrequencyOptions} style={{width: 150}}>
                                                            {doseFrequency ? Constants.relapseMedicationFrequency[doseFrequency] : ''}
                                                        </SelectBox>
                                                    </Column>
                                                </FormGroup>
                                            </Flex>
                                            <Flex>
                                                <FormGroup>
                                                    <Column>
                                                        <Text style={Styles.label}>Route</Text>
                                                        <SelectBox onPress={this.showRouteOptions} style={{width: 150}}>
                                                            {route ? Constants.relapseMedicationRoutes[route] : ''}
                                                        </SelectBox>
                                                    </Column>
                                                </FormGroup>
                                            </Flex>
                                        </Row>

                                        <Row>
                                            <Flex>
                                                <FormGroup>
                                                    <Column>
                                                        <Text style={Styles.label}>Date Started</Text>
                                                        <DatePicker
                                                            style={{alignSelf: "stretch", width: "100%", height: 54,}}
                                                            date={started ? moment(started) : null}
                                                            mode="date"
                                                            maxDate={moment()}
                                                            placeholder="Select date"
                                                            format="DD-MM-YYYY"
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
                                                            onDateChange={this.setDateStarted}
                                                        />
                                                    </Column>
                                                </FormGroup>
                                            </Flex>
                                            <Flex>
                                                <FormGroup>
                                                    <Column>
                                                        <Text style={Styles.label}>Date Stopped</Text>
                                                        <DatePicker
                                                            style={{alignSelf: "stretch", width: "100%", height: 54,}}
                                                            date={stopped ? moment(stopped) : null}
                                                            mode="date"
                                                            maxDate={moment()}
                                                            placeholder="Select date"
                                                            format="DD-MM-YYYY"
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
                                                            onDateChange={this.setDateStopped}
                                                        />
                                                    </Column>
                                                </FormGroup>
                                            </Flex>
                                        </Row>

                                        <FormGroup style={{marginBottom: 10}}>
                                            <Column>
                                                <Button onPress={() => this.props.onAdd(this.state)}
                                                        disabled={!this.isValid()}>
                                                    Add
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

AddRelapseMedication.propTypes = {};

module.exports = AddRelapseMedication;