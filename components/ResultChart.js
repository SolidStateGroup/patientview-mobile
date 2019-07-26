//Shows a line chart of results, with optional comparison between types

import React from 'react';
import {
    StyleSheet,
    Platform,
    View, processColor
} from 'react-native';

import {LineChart} from 'react-native-charts-wrapper';

class LineChartScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = Object.assign({}, this.parseResults(0))
    }

    shouldComponentUpdate(newProps, newState) {
        return this.state.extend !== newState.extend;
    }

    componentDidMount() {
        _.defer(() => { //Scroll to end of graph
            this.setState({xValue: Platform.OS == 'ios' ? 9999 : 9999})
        });
    }

    parseResults = (extend) => {
        var diff = 0;
        var first = 0;
        var last = 0;
        const unit = "months";
        let dataSets = []
        let latestResults;
        _.each(this.props.results, (items, i) => {
            let prevDate;
            let results = [];

            _.eachRight(items, (item) => {
                //Filter out results that are out of range or not a number
                if ((!item.value || isNaN(parseFloat(item.value)) || !item.applies)) {
                } else if (this.props.max[i] && this.props.max[i] < item.valueNum) {

                } else if (this.props.min[i] && this.props.min[i] > item.valueNum) {

                } else {
                    results.push(item);
                }
            });

            //Sort results by date
            results = _.sortBy(results, "applies");

            //Handle no results
            if (!results.length) {
                this.state = {
                    noResults: true
                }
                return;
            }

            var _first = results[0].applies,
                _last = results[results.length - 1].applies;

            //Keep track of min / max between result groups
            if (!first || _first < first) {
                first = _first;
            }

            if (!last || _last > last) {
                last = _last;
                latestResults = results;
            }

            diff = moment(last).diff(first, unit);

            //parse result into graph point
            let values = results.map((res) => this.parseResult(res, results))

            //Push dataset for group
            dataSets.push({
                values,
                label: this.props.labels[i],
                config: {
                    highlightLineWidth: 1,
                    lineWidth: 3,
                    drawCircles: true,
                    circleRadius: 2,
                    circleColor: processColor(styleVariables.circles[i]),
                    highlightColor: processColor(styleVariables.lines[i]),
                    color: processColor(styleVariables.lines[i]),
                    drawFilled: true,
                    fillColor: processColor('white'),
                    fillAlpha: 60,
                    valueTextSize: 0,
                }
            });

        });

        if (extend) { //If we're extending the graph, add months to the min / max values
            last = moment(last).startOf(unit).add("months", extend).valueOf();
            diff = moment(last).diff(first, unit);

            //Push transparent result to simulate extending graph
            dataSets = dataSets.concat([{
                label: "",
                config: {
                    highlightLineWidth: 0,
                    lineWidth: 0,
                    drawCircles: false,
                    circleRadius: 0,
                    circleColor: processColor(pallette.primaryDark),
                    highlightColor: processColor(pallette.primary),
                    color: processColor(pallette.primary),
                    drawFilled: true,
                    fillColor: processColor('white'),
                    fillAlpha: 0,
                    valueTextSize: 0,
                },
                values: [
                    this.parseResult({
                        value: latestResults[0].value,
                        applies: moment(last).valueOf()
                    }, latestResults)
                ]
            }]);

        }

        return {
            diff,
            results: this.props.results,
            extend: 0,
            data: {
                dataSets,
            },
            yAxis: {
                left: {
                    fontWeight: 'bold',
                    textColor: processColor(pallette.textLight),
                    gridLineWidth: Platform.OS == "android" ? 1 : 0.25,
                    gridColor: processColor(pallette.primaryDark),
                },
                right: {
                    enabled: false,
                    gridLineWidth: 0
                }
            },
            xAxis: {
                labelCountForce: true,
                textColor: processColor(colour.textLight),
                position: 'BOTTOM',
                gridLineWidth: Platform.OS == 'android' ? 0.25 : 0,
                labelRotationAngle: 90,
                //Create Formatted labels between min and max
                valueFormatter: _.range(0, diff + 2).map((i) => {
                    return moment(first).add(i, unit).format("MMMM YYYY")
                })
            },
            marker: {
                enabled: true,
                backgroundTint: processColor('white'),
                markerColor: processColor(pallette.primary),
                textColor: processColor('white'),
            }
        };
    };

    parseResult = (result, results, i) => {

        var first = results[0].applies;
        const unit = this.props.unit || "days";
        var firstUnit = moment(first).startOf(unit);

        const y = parseFloat(result.value);


        const relative = unit.slice(0, -1);

        //result date
        const m = moment(result.applies);

        //start of month for result
        const startOf = moment(m).startOf(relative);
        //end of month for result
        const endOf = moment(m).endOf(relative);

        const maxDuration = endOf.valueOf() - startOf.valueOf();
        const currentDuration = m.valueOf() - startOf.valueOf();


        //calculate time of day/month
        let fraction = currentDuration / maxDuration;
        fraction = isNaN(fraction) ? 0 : parseFloat(fraction.toFixed(2));
        const x = startOf.diff(firstUnit, unit) + (fraction);


        const marker = `${m.format("dddd Do MMM YYYY")}\n${result.value}`;

        global.prev = {x, y, m, marker};

        var res = {
            x,
            y,
            marker
        }


        return res;
    };

    handleSelect(event) {
        let entry = event.nativeEvent
        if (entry == null) {
            this.setState({...this.state, selectedEntry: null})
        } else {
            this.setState({...this.state, selectedEntry: JSON.stringify(entry)})
        }
    }

    addMonths = (months) => {
        this.setState(this.parseResults(months));
        _.defer(() => {
            this.setState({xValue: Platform.OS == 'ios' ? 9999 : 9999})
        });
    };

    showOptions = () => {
        API.showOptions("Sort results", _.flatMap(Constants.chartExtend), true)
            .then((i) => {
                if (i < Object.keys(Constants.chartExtend).length) {
                    const months = Object.keys(Constants.chartExtend)[i];
                    this.addMonths(months);
                    this.setState({extend: months});
                }
            });
    };

    showInfo = () => routeHelper.showInfoModal(this.props.navigator,
        "Extend Chart",
        "The Extend Chart function inserts a blank space to the end of the x-axis to allow for trend analysis and projection.",
        "About this feature"
    );

    render() {
        const {xValue} = this.state;

        if (this.state.noResults) {
            return (
                <Flex style={Styles.centeredContainer}>
                    <Text>You have no results.</Text>
                </Flex>
            )
        }
        return (
            <NetworkProvider>
                {(isConnected) => (
                    <View style={{height: DeviceHeight, backgroundColor: "#F5FCFF"}}>
                        <Fade value={1} autostart={true}
                              style={[styles.container, !isConnected && styles.containerDisconnected]}>

                            <Container>
                                <FormGroup>
                                    <Text style={Styles.center}>
                                        Slide left or right to see other results. Tap on a point to see the result
                                        value.
                                        Pinch the screen up or across to zoom in/out of a specific cluster of values or
                                        date period.
                                    </Text>
                                </FormGroup>
                            </Container>

                            <Flex>
                                <LineChart
                                    legend={{
                                        enabled: false,
                                    }}
                                    chartDescription={{text: " "}}
                                    style={styles.chart}
                                    data={this.state.data}
                                    marker={this.state.marker}
                                    yAxis={this.state.yAxis}
                                    xAxis={this.state.xAxis}
                                    scaleXEnabled={true}
                                    scaleYEnabled={true}
                                    drawBordersEnabled={false}
                                    drawGridLines={false}
                                    zoom={{
                                        scaleX: (this.state.diff / 12.2),
                                        scaleY: 1,
                                        xValue,
                                        yValue: 1,
                                        axisDependency: 'BOTTOM'
                                    }}
                                    pinchZoom={false}
                                    doubleTapToZoomEnabled={false}
                                    dragDecelerationEnabled={true}
                                    dragDecelerationFrictionCoef={0.99}
                                    keepPositionOnRotation={false}
                                    onSelect={this.handleSelect.bind(this)}
                                />
                            </Flex>

                            {/*Show a legend if we're displaying more than 1 result group*/}
                            {this.props.labels.length > 1 && (
                                <FormGroup>
                                    <Row style={{justifyContent: "center"}}>
                                        {this.props.labels.map((l, i) =>
                                            <Column>
                                                <Row>
                                                    <View
                                                        style={{
                                                            width: 20,
                                                            height: 20,
                                                            backgroundColor: styleVariables.lines[i]
                                                        }}/>
                                                    <Text>{l}</Text>
                                                </Row>
                                            </Column>
                                        )}
                                    </Row>
                                </FormGroup>
                            )}

                            <FormGroup style={{marginTop: 5}}>

                                <Column>
                                    <H2>Graph Actions</H2>
                                </Column>

                                <Row style={{marginTop: 10}}>
                                    <Column>
                                        <Text>
                                            Extend chart
                                        </Text>
                                    </Column>
                                    <Flex>
                                        <Column>
                                            <SelectBox onPress={this.showOptions}>
                                                {Constants.chartExtend[this.state.extend]}
                                            </SelectBox>
                                        </Column>
                                    </Flex>
                                    <Column>
                                        <Button
                                            onPress={this.showInfo}
                                            style={styles.infoButton}>
                                            <ION style={[Styles.buttonIcon, {color: "white"}]} name="md-information"/>
                                        </Button>
                                    </Column>
                                </Row>
                            </FormGroup>

                        </Fade>
                    </View>
                )}
            </NetworkProvider>
        );
    }
}

const styles = StyleSheet.create({
    infoButton: {
        backgroundColor: pallette.primary,
        width: 34,
        height: 34,
        borderRadius: 34 / 2
    },
    container: {
        height: DeviceHeight - 135,
        backgroundColor: '#F5FCFF'
    },
    containerDisconnected: {
        height: DeviceHeight - 175,
    },
    chart: {
        flex: 1,
    }
});

export default LineChartScreen;
