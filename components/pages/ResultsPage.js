/**
 * Created by kylejohnson on 28/01/2017.
 */
import React, {Component, PropTypes} from 'react';
import ResultsStore from '../../common/stores/results-store';

const ResultsPage = class extends Component {

    static navigatorStyle = global.navbarStyle;

    constructor(props, context) {
        super(props, context);
        this.state = {sort: Object.keys(Constants.resultSort)[0]};
        ES6Component(this);
    }

    componentWillMount() {
        routeHelper.handleNavEvent(this.props.navigator, 'results', this.onNavigatorEvent);
    }

    onNavigatorEvent = (event) => {
        if (event.id == Constants.navEvents.SHOW) {
            Utils.recordScreenView('Results Screen');
        } else if (event.id == Constants.navEvents.HIDE) {

        }
    };

    componentDidMount = () => {
        AppActions.setLestReadResults();
    };


    renderRow = ({item}) => {

        const {heading, units} = item;

        let lastObservation = "Not available",
            latestValue = "";

        //Show latest observation as not available if there are none, othewrise show the date
        if (item.latestObservation) { //
            lastObservation = Format.dateAndTime(item.latestObservation.applies);
            latestValue = item.latestObservation.value;
        }

        const isLatest = item.isLatest;

        return (
            <ListItem
                onPress={() => routeHelper.goResult(this.props.navigator, item, ResultsStore.findMatchingHeading(item))}>
                <View>

                    <Row>
                        <Text style={Styles.listItemTitle}>{heading} </Text>
                        {latestValue ? (
                            <Text
                                style={[Styles.listItemTitle, {color: pallette.primary}]}>{latestValue} {units}</Text>
                        ) : null}
                    </Row>

                    <Text style={Styles.listSubText}>
                        {lastObservation}
                    </Text>
                </View>

                <Row>
                    {isLatest && (
                        <Column>
                            <View style={{padding: 2, borderRadius: 4, backgroundColor: colour.secondary}}>
                                <Text style={[{color: 'white', fontWeight: "bold", fontSize: em(1)}]}>Latest</Text>
                            </View>
                        </Column>
                    )}
                    <ION name="ios-arrow-forward" style={[Styles.listIconNav]}/>
                </Row>
            </ListItem>
        )
    };


    showSortOptions = () => {
        API.showOptions("Sort results", _.flatMap(Constants.resultSort), true)
            .then((i)=> {
                if (i < Object.keys(Constants.resultSort).length)
                    this.setState({sort: Object.keys(Constants.resultSort)[i]})
            })
    };

    render() {
        return (
            <Flex>
                <NetworkBar
                    message="It seems you are offline, your results will automatically sync when you go back online."/>
                <FormGroup>
                    <Column>
                        <TextInput placeholder={"Search"}
                                   onChangeText={(search)=>this.setState({search})}/>
                    </Column>
                    <FormGroup>
                        <Row>
                            <Column>
                                <Text>Sort By</Text>
                            </Column>
                            <Flex>
                                <Column>
                                    <SelectBox onPress={this.showSortOptions} style={{width: 150}}>
                                        {Constants.resultSort[this.state.sort]}
                                    </SelectBox>
                                </Column>
                            </Flex>
                        </Row>
                    </FormGroup>
                </FormGroup>
                <Flex style={Styles.body}>
                    <FlatList
                        keyExtractor={(i)=>`${i.group.id}-${i.id}`}
                        data={ResultsStore.getResultPanels(this.state.search, this.state.sort)}
                        renderItem={this.renderRow}
                    />
                </Flex>
            </Flex>
        )
    }
};

ResultsPage.propTypes = {};

module.exports = ResultsPage;