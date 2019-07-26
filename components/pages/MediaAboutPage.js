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
            Utils.recordScreenView('About Media Screen');
        } else if (event.id == Constants.navEvents.HIDE) {

        } else if (event.id == "close") {
            this.props.navigator.dismissModal()
        }
    };

    render() {
        return (
            <Flex style={Styles.whiteContainer}>
                <Container>
                    <ScrollView>
                        <H2 style={{marginBottom: 20}}>My Media</H2>
                        <Text style={{marginBottom: 10}}>
                            1. To upload a media item: Tap the 'Upload' button and select a file from your phone that
                            you would like to store as part of your PatientView records. You can only select one file at
                            a time and it must be below 5MB.
                            {"\n\n"}
                            2. To view full size: Tap a thumbnail to view in full size mode and then pinch to zoom in
                            and out.
                            {"\n\n"}
                            3. To share in secure message: Tap and hold a thumbnail to bring up the thumbnail selection
                            view. Tick the thumbnail(s) of the file(s) you wish to share and then click the Share
                            button. Select the PatientView conversation you wish to share to (this must have been
                            created already). File are sent individually to the recipient list.
                            {"\n\n"}

                            4. To delete media item(s): Tap and hold a thumbnail to bring up the thumbnail selection
                            view. Tick the thumbnail(s) of the file(s) you wish to delete and then click the Delete
                            button. You will be asked to confirm your deletion. Note that files which are deleted will
                            also be deleted from shared conversations. Note also that your files are deleted from the
                            PatientView application only and would continue to be stored in your device's memory (unless
                            you delete them separately).

                        </Text>
                    </ScrollView>
                </Container>
            </Flex>
        )
    }
};


MedicinesAboutPage.propTypes = {};


module.exports = MedicinesAboutPage;
