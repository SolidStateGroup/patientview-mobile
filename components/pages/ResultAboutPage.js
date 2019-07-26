/**
 * Created by kylejohnson on 28/01/2017.
 */
import React, {Component, PropTypes} from 'react';

const MedicinesAboutPage = class extends Component {

    static navigatorStyle = global.navbarStyle;

    displayName: 'MedicinesAboutPage'

    constructor(props, context) {
        super(props, context);
        this.state = {};
        routeHelper.handleNavEvent(this.props.navigator, 'about-medicines', this.onNavigatorEvent);
    }

    onNavigatorEvent = (event) => {
        if (event.id == Constants.navEvents.SHOW) {
            Utils.recordScreenView('About Medicines Screen');
        } else if (event.id == Constants.navEvents.HIDE) {

        } else if (event.id == "close") {
            this.props.navigator.dismissModal()
        }
    };

    render() {
        const {result} = this.props;
        return (
            <Flex style={Styles.whiteContainer}>
                <Container>
                    <Row style={styles.row}>
                        <View style={styles.heading}>
                            <Text>
                                Name
                            </Text>
                        </View>
                        <Flex>
                            <Text>
                                {result.name || result.heading}
                            </Text>
                        </Flex>
                    </Row>
                    <Row style={styles.row}>
                        <View style={styles.heading}>
                            <Text>
                                Heading
                            </Text>
                        </View>
                        <Flex>
                            <Text>
                                {result.heading}
                            </Text>
                        </Flex>
                    </Row>
                    {(result.units || null) && (
                        <Row style={styles.row}>
                            <View style={styles.heading}>
                                <Text>
                                    Units
                                </Text>
                            </View>
                            <Flex>
                                <Text>
                                    {result.units}
                                </Text>
                            </Flex>
                        </Row>
                    )}

                    {(result.normalRange||null) && (
                        <Row style={styles.row}>
                            <View style={styles.heading}>
                                <Text>
                                    Normal Range
                                </Text>
                            </View>
                            <Flex>
                                <Text>
                                    {result.normalRange}
                                </Text>
                            </Flex>
                        </Row>
                    )}

                    {(result.infoLink||null) && (
                        <Row style={styles.row}>
                            <View style={styles.heading}>
                                <Text>
                                    Information
                                </Text>
                            </View>
                            <Flex style={styles.heading}>
                                <TouchableOpacity
                                    onPress={()=>Linking.openURL(result.infoLink)}
                                >
                                    <Text style={{color: colour.primary}}>
                                        More information about this test
                                    </Text>
                                </TouchableOpacity>
                            </Flex>
                        </Row>
                    )}

                </Container>
            </Flex>
        )
    }
};

var styles = StyleSheet.create({
    heading: {
        width: 200
    },
    row: {
        flexWrap: 'nowrap',
        paddingBottom: 10,
        marginBottom: 10,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderColor: colour.divider
    }
})
MedicinesAboutPage.propTypes = {};


module.exports = MedicinesAboutPage;
