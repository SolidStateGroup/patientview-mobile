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
        const {isLoading, resultClusters} = this.state;
        const insDiaryRecording = AccountStore.hasGroupFeature('INS_DIARY');
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
                        {insDiaryRecording && (
                            <FormGroup>
                                <Column>
                                    <Button onPress={() => routeHelper.goINSDiaryRecordings(this.props.navigator)} style={Styles.buttonINSDiaryRecordings}>
                                        INS Diary Recordings
                                    </Button>
                                </Column>
                            </FormGroup>
                        )}
                    </View>
                </Flex>
            );
    }
};

TheComponent.propTypes = {};

module.exports = TheComponent;