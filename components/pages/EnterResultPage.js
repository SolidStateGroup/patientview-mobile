import React, {Component, PropTypes} from 'react';
import api from '../../common/data/results';
import DatePicker from 'react-native-datepicker'

const TheComponent = class extends Component {
    static navigatorStyle = global.navbarStyle;
    displayName: 'TheComponent'

    getInitialState() {
        var m = moment();
        return {
            isSaving: false,
            date: m,
            day: m.format("DD"),
            month: m.format("MM"),
            year: parseInt(m.format("YYYY")),
            hour: parseInt(m.format("HH")),
            minute: m.format("mm"),
            values: []
        };
    }

    constructor(props, context) {
        super(props, context);
        this.state = this.getInitialState()
        ES6Component(this);
    }

    componentWillMount() {
        routeHelper.handleNavEvent(this.props.navigator, 'enter-result', this.onNavigatorEvent);
    }


    save = (dismiss) => {
        const {day, month, year, hour, minute, values, comments} = this.state
        api.enterResult(AccountStore.getUserId(), {day, month, year, hour, minute, values, comments})
            .then((res) => {
                _.each(values, (v) => {
                    const {resultCluster} = this.props;
                    const {resultClusterObservationHeadings} = resultCluster;
                    const result = _.find(resultClusterObservationHeadings, (r) => {
                        return parseInt(r.observationHeading && r.observationHeading.id) == parseInt(v.id);
                    });
                    if (result) {
                        AppActions.getResults(result.observationHeading.code)
                    }
                })
                if (dismiss) {
                    this.props.navigator.dismissModal();
                } else {
                    this.setState(this.getInitialState())
                    alert("Result saved");
                }
                AppActions.getResultsSummary();
            })
    }

    onNavigatorEvent = (event) => {
        if (event.id == Constants.navEvents.SHOW) {
            Utils.recordScreenView('Enter Result Screen ' + this.props.resultCluster.name);
        }
        if (event.id == 'close') {
            this.props.navigator.dismissModal();
        }
    };

    setDate = (date) => {
        var m = moment(new Date(date));
        this.setState({
            date,
            day: m.format("DD"),
            month: m.format("MM"),
            year: parseInt(m.format("YYYY")),
            hour: parseInt(m.format("HH")),
            minute: parseInt(m.format("mm")),
        });
    };

    setValue = (value, id) => {
        var values = _.filter(this.state.values, (v) => v.id != id);
        if (value) {
            values.push({value, id});
        }
        this.setState({values})
    };

    getValue = (id) => {
        var find = _.find(this.state.values, {id})
        return find && find.value;
    }

    render() {
        const {resultCluster} = this.props;
        const {resultClusterObservationHeadings} = resultCluster;


        return (
            <KeyboardAvoidingView style={{flex: 1}} behavior={"padding"}
                                  keyboardVerticalOffset={ReactNative.Platform.OS == 'android' ? -260 : 64}>
                <Flex style={Styles.whiteContainer}>
                    <NetworkBar message="It seems you are offline, you need to be online to enter your own data."/>
                    <Flex>
                        <Container style={{flex: 1}}>
                            <KeyboardAwareScrollView keyboardShouldPersistTaps={"handled"} style={{flex: 1}}
                                                     extraScrollHeight={44}>
                                <Row style={{justifyContent: "flex-start"}}>
                                    <View>
                                        <FormGroup style={{height: 54, justifyContent: "center"}}>
                                            <H2>Result Date</H2>
                                        </FormGroup>
                                        {resultClusterObservationHeadings && resultClusterObservationHeadings
                                            .map(({observationHeading}) => (
                                                <FormGroup style={{height: 54, justifyContent: "center"}}>
                                                    <H2>{observationHeading.heading} {observationHeading.units && `(${observationHeading.units})`}:</H2>
                                                </FormGroup>
                                            ))}
                                    </View>
                                    <Flex>
                                        <FormGroup style={{height: 54, justifyContent: "center"}}>
                                            <Column>
                                                <DatePicker
                                                    style={{alignSelf: "stretch", width: "100%", height: 54,}}
                                                    date={this.state.date}
                                                    mode="datetime"
                                                    placeholder="Tap to select date"
                                                    format="DD-MMM-YYYY HH:mm"
                                                    confirmBtnText="Confirm"
                                                    cancelBtnText="Cancel"
                                                    maxDate={moment()}
                                                    customStyles={{
                                                        dateInput: [Styles.inputContainer, {
                                                            height: 44,
                                                            alignItems: "flex-start",
                                                            paddingLeft: 10,
                                                            alignSelf: "stretch"
                                                        }]
                                                        // ... You can check the source to find the other keys.
                                                    }}
                                                    onDateChange={(date) => {
                                                        this.setDate(date)
                                                    }}
                                                />
                                            </Column>
                                        </FormGroup>
                                        {resultClusterObservationHeadings && resultClusterObservationHeadings
                                            .map(({observationHeading}) => (
                                                <FormGroup style={{height: 54, justifyContent: "center"}}>
                                                    <Column>
                                                        <TextInput
                                                            value={this.getValue(observationHeading.id + "")}
                                                            keyboardType={"numeric"}
                                                            onChangeText={(t) => {
                                                                this.setValue(t, observationHeading.id + "")
                                                            }}
                                                        />
                                                    </Column>
                                                </FormGroup>
                                            ))}
                                    </Flex>
                                </Row>

                                <FormGroup>
                                    <H2>Comments</H2>
                                </FormGroup>
                                <FormGroup>
                                    <TextInput
                                        multiline={true}
                                        textStyle={{flex: 1}}
                                        minLines={2}
                                        maxLines={5}
                                        onChangeText={(comments) => this.setState({comments})}
                                        value={this.state.comments}
                                    />
                                </FormGroup>
                            </KeyboardAwareScrollView>
                        </Container>
                    </Flex>
                    <NetworkProvider>
                        {(isConnected) => (
                            <FormGroup style={{marginBottom: 10}}>
                                <Row style={{justifyContent: "center"}}>
                                    <Column>
                                        <Button onPress={() => this.save(true)}
                                                disabled={!isConnected || this.state.saving || !this.state.values.length}>
                                            {this.state.saving ? "Saving..." : "Save & Finish"}
                                        </Button>
                                    </Column>
                                    <Column>
                                        <Button onPress={() => this.save(false)}
                                                disabled={!isConnected ||this.state.saving || !this.state.values.length}>
                                            {this.state.saving ? "Saving..." : "Save & Add More"}
                                        </Button>
                                    </Column>
                                </Row>
                            </FormGroup>
                        )}
                    </NetworkProvider>
                </Flex>
            </KeyboardAvoidingView>
        );
    }
};

TheComponent.propTypes = {};

module.exports = TheComponent;