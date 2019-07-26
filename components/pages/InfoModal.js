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
            Utils.recordScreenView(this.props.title + ' Info Screen');
        } else if (event.id == Constants.navEvents.HIDE) {

        } else if (event.id == "close") {
            this.props.navigator.dismissModal()
        }
    };

    render() {
        return (
            <Flex style={Styles.whiteContainer}>
                <Container>
                    {this.props.subtitle && (
                        <H2 style={{marginTop: 20}}>{this.props.subtitle}</H2>
                    )}
                    <FormGroup>
                        <Text>
                            {this.props.message}
                        </Text>
                    </FormGroup>
                </Container>
            </Flex>
        )
    }
};


MedicinesAboutPage.propTypes = {};


module.exports = MedicinesAboutPage;
