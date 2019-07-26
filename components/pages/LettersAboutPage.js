/**
 * Created by kylejohnson on 28/01/2017.
 */
import React, {Component, PropTypes} from 'react';

const MedicinesAboutPage = class extends Component {

    static navigatorStyle = global.navbarStyle;

    displayName: 'MedicinesAboutPage'

    constructor (props, context) {
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

    render () {
        return (
            <Flex style={Styles.whiteContainer}>
                <Container>
                    <H2 style={{marginBottom:20}}>Letters</H2>
                    <Text style={{marginBottom:10}}>Letters are only shown when they have been sent by your unit's computer system.</Text>
                    <Text style={{marginBottom:10}}>It is important to note that letters may be shown here before they have been finally approved and had mistakes corrected. This mainly applies if you are reading letters soon (e.g. within a week) after they have been typed.</Text>
                    <Text style={{marginBottom:10}}>If you have any concerns you should discuss it at your next clinic appointment, or contact the author of the letter. You may delete letters if you don't want them, or if you find duplicates. This only removes the PatientView copy, but please be careful, it isn't easy to restore them. Deletions will be recorded.</Text>
                </Container>
            </Flex>
        )
    }
};


MedicinesAboutPage.propTypes = {};


module.exports = MedicinesAboutPage;
