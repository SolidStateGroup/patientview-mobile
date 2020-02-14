import React, {Component, PropTypes} from 'react';
import DatePicker from 'react-native-datepicker';

const Immunisation = class extends Component {
    static displayName = 'Immunisation';
    static navigatorStyle = global.navbarStyle;

    constructor(props, context) {
        super(props, context);
        const { entry } = this.props;
        this.state = {
            ...entry,
            edit: !!entry,
            immunisationDate: entry ? entry.immunisationDate : moment().startOf('day'),
        };
        ES6Component(this)
    }

    componentWillMount() {
        this.listenTo(ImmunisationsStore, "saved", () => {
            this.props.navigator.pop();
        });
        this.listenTo(ImmunisationsStore, "change", () => {
            this.setState({
                saving: ImmunisationsStore.isSaving
            });
        });
        this.listenTo(ImmunisationsStore, 'problem', () => {
            Alert.alert('Error', ImmunisationsStore.error);
        })
        routeHelper.handleNavEvent(this.props.navigator, 'message', this.onNavigatorEvent);
    }

    setImmunisationDate = (date) => this.setState({immunisationDate: moment(date, 'DD-MM-YYYY').valueOf()});

    showImmunisationTypeOptions = () => {
        API.showOptions("Immunisation Type", _.flatMap(Constants.immunisationCodes), true)
            .then((i)=> {
                if (i < Object.keys(Constants.immunisationCodes).length)
                    this.setState({codelist: Object.keys(Constants.immunisationCodes)[i]})
            })
    }

    setOtherImmunisationType = (other) => this.setState({other});

    save = () => {
        const { edit, id, immunisationDate, codelist } = this.state;
        const immunisation = {
            immunisationDate,
            codelist,
        }
        if (edit) {
            AppActions.updateINSImmunisation(id, immunisation);
        } else {
            AppActions.saveINSImmunisation(immunisation);
        }
    };

    isValid = () => {
        const { codelist, other } = this.state;
        if (!codelist || (codelist === 'OTHER' && !other)) return false;
        return true;
    }

    onNavigatorEvent = (event) => {
        if (event.id == Constants.navEvents.SHOW) {
            Utils.recordScreenView('INS Immunisation Screen');
        }
        if (event.id == 'close') {
            this.props.navigator.dismissModal();
        }
    };

    render() {
        const {
            edit, immunisationDate, codelist, other,
        } = this.state;
        return (
            <Flex>
                <NetworkProvider>
                    {(isConnected) => (
                        <Flex style={Styles.whiteContainer}>
                            <NetworkBar
                                message="It seems you are offline, you need to be online to record an immunisation."/>

                            <Flex>
                                <Container style={{flex: 1}}>
                                    <KeyboardAwareScrollView keyboardShouldPersistTaps={"handled"} style={{flex: 1}}>
                                        <FormGroup>
                                            <Column>
                                                <Text style={Styles.label}>Immunisation Date</Text>
                                                <DatePicker
                                                    style={{alignSelf: "stretch", width: "100%", height: 54,}}
                                                    date={moment(immunisationDate)}
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
                                                    onDateChange={this.setImmunisationDate}
                                                />
                                            </Column>
                                        </FormGroup>

                                        <FormGroup>
                                            <Column>
                                                <Text style={Styles.label}>Immunisation Type</Text>
                                                <SelectBox onPress={this.showImmunisationTypeOptions} style={{width: 150}}>
                                                    {Constants.immunisationCodes[codelist]}
                                                </SelectBox>
                                            </Column>
                                        </FormGroup>

                                        {codelist === 'OTHER' && (
                                            <FormGroup>
                                                <Column>
                                                    <TextInput
                                                        value={other}
                                                        onChangeText={this.setOtherImmunisationType}
                                                        maxLength={100}
                                                        placeholder="Please Specify"
                                                    />
                                                </Column>
                                            </FormGroup>
                                        )}
                                        
                                        <FormGroup style={[Styles.mt10, Styles.mb10]}>
                                            <Column>
                                                <Button onPress={() => this.save(false)}
                                                        disabled={!isConnected || this.state.saving || !this.isValid()}>
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

Immunisation.propTypes = {};

module.exports = Immunisation;