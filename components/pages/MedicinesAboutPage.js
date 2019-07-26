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
                    <H2 style={{marginTop:20}}>Medicines</H2>
                    <Text>
                        Medicine lists come from a hospital or your GP’s computer system. Please read the cautions and
                        explanation:
                    </Text>
                    <H2 style={{marginTop:20}}>Important</H2>
                    <Text>
                        The list of medicines may not be complete or accurate, because (1) Some hospitals do not yet
                        keep
                        full records of medicines for all patients, (2) Changes made in one place may not quickly get to
                        every list. Please point out changes when you next attend an appointment, or send a note or
                        message
                        if it is important.
                   </Text>
                    <H2 style={{marginTop:20}}>Two Kinds of List</H2>
                    <Text>
                        Lists from your GP sometimes show some medicines twice; once as regular medicines and once as
                        one-off prescriptions. For one-off you may see a number in brackets, the numbers of tablets
                        prescribed, like (28). Or (RP) to show it's a repeat prescription.

                        This link to <Text
                        onPress={()=>routeHelper.openWebModal(this.props.navigator, "https://www.nlm.nih.gov/medlineplus/druginformation.html", "Medline Plus")}
                        style={[Styles.anchor, { color: colour.primary }]}>Medline Plus</Text> is good if you want more
                        information on individual drugs, or on herbs and supplements.</Text>
                </Container>
            </Flex>
        )
    }
};


MedicinesAboutPage.propTypes = {};


module.exports = MedicinesAboutPage;
