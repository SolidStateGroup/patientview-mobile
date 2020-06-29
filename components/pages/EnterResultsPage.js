import React, {Component, PropTypes} from 'react';

const TheComponent = class extends Component {
    displayName: 'TheComponent'
    static navigatorStyle = global.navbarStyle;

    constructor(props, context) {
        super(props, context);
        this.state = {isLoading: true};
        ES6Component(this)
    }


    componentWillMount() {
        this.listenTo(ResultClustersStore, "change", () => {
            this.setState({
                resultClusters: ResultClustersStore.model,
                isLoading: ResultClustersStore.isLoading
            })
        });
        AppActions.getResultClusters();
        routeHelper.handleNavEvent(this.props.navigator, 'enter-result', this.onNavigatorEvent);
    }


    onNavigatorEvent = (event) => {
        if (event.id == Constants.navEvents.SHOW) {
            Utils.recordScreenView('Enter Results Screen');
        }
        if (event.id == 'close') {
            this.props.navigator.dismissModal();
        }
    };


    render() {
        const {isLoading, resultClusters, isSaving} = this.state;
        const medpic = AccountStore.hasGroupFeature('MEDPIC');
        return isLoading ?
            <Flex>
                <NetworkBar message="It seems you are offline, you need to be online to enter your own data."/>
                <View style={Styles.centeredContainer}>
                    <Loader/>
                </View>
            </Flex>
            : (
                <Flex style={Styles.whiteContainer}>
                    <NetworkBar message="It seems you are offline, you need to be online to enter your own data."/>
                    <FormGroup style={[Styles.greyContainer, {paddingBottom: 10}]}>
                        <Container>
                            <Text style={Styles.bold}>
                                Select the results you would like to add:
                            </Text>
                        </Container>
                    </FormGroup>
                    <View>
                        {resultClusters && resultClusters.length ?
                            resultClusters.map((r) =>
                                r.resultClusterObservationHeadings.length ?
                                    <ListItem
                                        key={r.id}
                                        onPress={() => routeHelper.goEnterResult(this.props.navigator, r)}>
                                        <Text>{r.name}</Text>
                                        <ION name="ios-arrow-forward" style={[Styles.listIconNav]}/>
                                    </ListItem> : <View/>
                            )
                            : (
                                <Text>You do not have any result clusters</Text>
                            )}
                        <FormGroup>
                            <Column>
                                <Button onPress={() => routeHelper.goEditResults(this.props.navigator)}>
                                    View & Edit Past Entries
                                </Button>
                            </Column>
                        </FormGroup>
                        {medpic && (
                            <>
                                <Container style={Styles.mt5}>
                                    <Text style={Styles.bold}>Entering blood pressure from a photo</Text>
                                    <Text style={Styles.mt5}>Please take a clear photo of the readings on your BP monitor. The numbers from that can automatically be saved to your PatientView record. <Text
                                        onPress={()=>Linking.openURL('http://help.patientview.org/patientview2/howto/user-guide-for-patients/uploading-blood-pressure-from-a-photo/')}
                                        style={[Styles.anchor, {color: colour.primary}]}>More info and help here.</Text></Text>
                                </Container>
                                {isSaving ? (
                                    <Flex style={Styles.centeredContainer}>
                                        <Loader/>
                                    </Flex>
                                ) : (
                                    <View>
                                        <FormGroup>
                                            <Column>
                                                <Button onPress={() => this.takeMedPicPhoto(true)}>
                                                    <Row style={Styles.alignCenter}>
                                                        <FontAwesome style={[Styles.listItemIcon, Styles.mr5, {color: pallette.white}]} name="camera"/>
                                                        <Text style={Styles.buttonText}>Take Photo</Text>
                                                    </Row>
                                                </Button>
                                            </Column>
                                        </FormGroup>
                                        <FormGroup>
                                            <Column>
                                                <Button onPress={() => this.takeMedPicPhoto(false)}>
                                                    <Row style={Styles.alignCenter}>
                                                        <FontAwesome style={[Styles.listItemIcon, Styles.mr5, {color: pallette.white}]} name="image"/>
                                                        <Text style={Styles.buttonText}>Upload Gallery Photo</Text>
                                                    </Row>
                                                </Button>
                                            </Column>
                                        </FormGroup>
                                    </View>
                                )}
                            </>
                        )}
                    </View>
                </Flex>
            );
    }
};

TheComponent.propTypes = {};

module.exports = TheComponent;