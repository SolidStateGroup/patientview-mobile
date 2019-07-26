/**
 * Created by kylejohnson on 28/01/2017.
 */
import React, {Component, PropTypes} from 'react';
import ResultStore from '../../common/stores/result-store';
import ResultChart from '../ResultChart';
import ResultTable from '../ResultTable'


const ResultDetailsPage = class extends Component {

    static navigatorStyle = global.navbarStyle;

    displayName: 'ResultsPage'

    constructor(props, context) {
        super(props, context);

        this.state = {
            isLoading: _.find(this.props.results, (result) => {
                return !ResultStore.getResults(result.code)
            }),
            results: this.props.results.map((result) => ResultStore.getResults(result.code)),
        };

        ES6Component(this);
    }

    componentWillMount() {
        routeHelper.handleNavEvent(this.props.navigator, 'results', this.onNavigatorEvent);
        this.listenTo(ResultStore, 'change', () => {
            this.setState({
                isLoading: _.find(this.props.results, (result) => {
                    return !ResultStore.getResults(result.code)
                }),
                results: this.props.results.map((result) => ResultStore.getResults(result.code)),
            })
        });
        _.each(this.props.results, (result) => {
            AppActions.getResults(result.code);
        })
    }

    onNavigatorEvent = (event) => {
        if (event.id == Constants.navEvents.SHOW) {
            Utils.recordScreenView('Result Details Screen ' + this.props.results[0].code);
        } else if (event.id == 'info') {
            routeHelper.showAboutResult(this.props.navigator, this.props.results[0])
        }  if (event.id == 'close') {
            this.props.navigator.dismissModal();
        }
    };

    render() {
        let {units} = this.props.results[0];
        units = units || ""
        return (
            <Flex>
                <NetworkBar
                    message="It seems you are offline, results will automatically sync when you go back online."/>
                <NetworkProvider>
                    {(isConnected) => (
                        <Flex style={Styles.body}>
                            {this.state.isLoading && !this.state.results ? (
                                <Flex style={Styles.centeredContainer}>
                                    <Loader/>
                                    <Text>Loading Result Data</Text>
                                </Flex>
                            ) : (
                                <Flex>
                                    {this.state.results && this.state.results[0] && this.state.results[0].length ? (
                                        <Flex>
                                            <FormGroup style={[Styles.greyContainer, {paddingBottom: 10}]}>
                                                <Column>
                                                    <Row style={{justifyContent: 'center'}}>
                                                        <Button
                                                            style={[Styles.buttonGroupLeft, {
                                                                height: 34,
                                                                width: 50
                                                            }, this.state.graph && {backgroundColor: pallette.textWhite}]}
                                                            onPress={() => {
                                                                Utils.record("View Result Table")
                                                                this.setState({graph: false})
                                                            }}>
                                                            <ION style={{
                                                                fontSize: em(2),
                                                                color: !this.state.graph ? 'white' : colour.textLight
                                                            }} name="md-grid"/>
                                                        </Button>
                                                        <Button
                                                            style={[Styles.buttonGroupRight, {
                                                                height: 34,
                                                                width: 50
                                                            }, !this.state.graph && {backgroundColor: pallette.textWhite}]}
                                                            onPress={() => {
                                                                Utils.record("View Result Graph")
                                                                this.setState({graph: true})
                                                            }}>
                                                            <ION style={{
                                                                fontSize: em(2),
                                                                color: this.state.graph ? 'white' : colour.textLight
                                                            }} name="ios-stats"/>
                                                        </Button>
                                                    </Row>
                                                </Column>
                                            </FormGroup>
                                            <View style={{
                                                backgroundColor: 'white',
                                                overflow: 'hidden',
                                                height: this.state.graph ? null : 0,
                                                flex: this.state.graph ? 1 : 0
                                            }}>
                                                <Delay delay={500}>
                                                    <Flex style={Styles.centeredContainer}><Loader/></Flex>
                                                    <ResultChart
                                                        navigator={this.props.navigator}
                                                        diffUnit="days"
                                                        unit="months"
                                                        min={[this.props.results[0].minGraph, this.props.results[1] && this.props.results[1].minGraph]}
                                                        max={[this.props.results[0].maxGraph,this.props.results[1] && this.props.results[1].maxGraph]}
                                                        labels={this.props.results.map((r) => r.heading)}
                                                        results={this.state.results}/>
                                                </Delay>
                                            </View>
                                            <View style={{
                                                backgroundColor: 'white',
                                                overflow: 'hidden',
                                                height: !this.state.graph ? null : 0,
                                                flex: !this.state.graph ? 1 : 0
                                            }}>
                                                <ResultTable results={this.state.results[0]}/>
                                            </View>
                                        </Flex>
                                    ) : (
                                        <Flex style={Styles.centeredContainer}>
                                            {this.state.isLoading ? <Loader/>
                                                : (
                                                    <Text style={Styles.center}>You have no
                                                        results{isConnected ? "" : ", this may be because you are offline."}</Text>
                                                )}
                                        </Flex>
                                    )}
                                </Flex>
                            )}
                        </Flex>
                    )}
                </NetworkProvider>
            </Flex>
        )
    }
};


ResultDetailsPage.propTypes = {};

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f7f7f7',
    },
});


module.exports = ResultDetailsPage;