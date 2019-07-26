import React, {Component, PropTypes} from 'react';
import EditResultTable from '../EditResultTable'

const TheComponent = class extends Component {
    displayName: 'TheComponent'
    static navigatorStyle = global.navbarStyle;

    constructor(props, context) {
        super(props, context);
        this.state = {isLoading: true};
        if (EditResultsStore.model)
            this.state = Object.assign({}, this.getState(), this.state);
        ES6Component(this)
    }

    getState = () => {
        var groups = EditResultsStore.model && Object.keys(EditResultsStore.model)
        if (groups) {
            groups = _.filter(_.sortBy(groups, (g) => g), (g) => {
                return EditResultsStore.model[g] && EditResultsStore.model[g].length != 0
            });
        }
        this.setState({
            resultClusters: EditResultsStore.model,
            isLoading: EditResultsStore.isLoading,
            selectedGroup: this.state.selectedGroup || (groups && groups[0]),
            groups
        })
    }

    componentWillMount() {
        this.listenTo(EditResultsStore, "change", () => {
            this.setState(this.getState())
        });
        AppActions.getEditResults();
        routeHelper.handleNavEvent(this.props.navigator, 'edit-results', this.onNavigatorEvent);
    }


    onNavigatorEvent = (event) => {
        if (event.id == Constants.navEvents.SHOW) {
            Utils.recordScreenView('Edit Results Screen');
        }
        if (event.id == 'close') {
            this.props.navigator.dismissModal();
        }
    };

    showResultOptions = () => {
        API.showOptions("Results", this.state.groups, true)
            .then((i) => {
                if (i < this.state.groups.length) {
                    this.setState({selectedGroup: this.state.groups[i]})
                }
            })

    };

    onEditPress = (r) => {
        routeHelper.showEditResult(this.props.navigator, r);
    };

    onRemovePress = (r) => {
        Alert.alert(
            `Delete value for ${this.state.selectedGroup}`,
            `Are you sure? This will delete entered value ${r.value} for result ${this.state.selectedGroup}.`,
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {
                    text: 'OK', onPress: () => {
                        AppActions.removeResult(r);
                    }
                },
            ],
            {cancelable: false}
        );
    };

    render() {
        const {isLoading, resultClusters, selectedGroup, groups} = this.state;
        const selectedResults = resultClusters && selectedGroup && resultClusters[selectedGroup];
        return isLoading && !resultClusters ?
            <Flex>
                <NetworkBar message="It seems you are offline, you need to be online to enter your own data."/>
                <View style={Styles.centeredContainer}>
                    <Loader/>
                </View>
            </Flex>
            : (
                <Flex style={Styles.whiteContainer}>
                    <NetworkBar message="It seems you are offline, you need to be online to enter your own data."/>

                    {groups && groups.length ? (
                        <Flex>

                            <Container>
                                <FormGroup>
                                    <H2>
                                        Please select a result type to view/edit
                                    </H2>
                                </FormGroup>
                                <FormGroup>
                                    <SelectBox onPress={this.showResultOptions} style={{width: 150}}>
                                        {this.state.selectedGroup}
                                    </SelectBox>
                                </FormGroup>
                            </Container>
                            <Flex style={{opacity: isLoading ? 0.5 : 1}}>
                                {selectedResults && selectedResults.length ? (
                                    <NetworkProvider>
                                        {(isConnected) => (
                                            <EditResultTable
                                                isConnected={isConnected}
                                                results={selectedResults}
                                                onEditPress={this.onEditPress}
                                                onRemovePress={this.onRemovePress}
                                            />
                                        )}
                                    </NetworkProvider>
                                ) : (
                                    <Text style={Styles.center}>
                                        You have no user entered results for {selectedGroup}
                                    </Text>
                                )}

                            </Flex>
                        </Flex>
                    ) : (
                        <Text style={Styles.center}>
                            No user entered results found
                        </Text>
                    )}

                </Flex>
            );
    }
};

TheComponent.propTypes = {};

module.exports = TheComponent;