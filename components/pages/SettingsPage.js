/**
 * Created by kylejohnson on 28/01/2017.
 * Settlings list page
 */
import React, {Component, PropTypes} from 'react';
const SettingsPage = class extends Component {

    static navigatorStyle = global.navbarStyle;
    
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    componentWillMount() {
        routeHelper.handleNavEvent(this.props.navigator, 'settings', this.onNavigatorEvent);
    }

    onNavigatorEvent = (event) => {
        if (event.id == Constants.navEvents.SHOW) {
            Utils.recordScreenView('Settings Screen');
        } else if (event.id == Constants.navEvents.HIDE) {

        } else if (event.id == 'close') {
            this.props.navigator.dismissModal();
        }
    };

    render() {
        return (
            <Flex style={Styles.whiteContainer}>
                <NetworkBar message="It seems you are offline, you need to be online to update your settings."/>
                <Flex style={[Styles.body,{padding:20}]}>
                    <Flex>
                        {/*Contact Settings*/}
                        <ListItem
                            icon={<ION name="md-person" style={[Styles.listIcon, { color: pallette.primary }]}/>}
                            onPress={() => routeHelper.goContactSettings(this.props.navigator)}>
                            <Text>Contact Settings</Text>
                            <ION name="ios-arrow-forward" style={[Styles.listIconNav]}/>
                        </ListItem>
                        {/*Secret Word Settings*/}
                        <ListItem
                            onPress={() => routeHelper.goSecretWordSettings(this.props.navigator)}
                            icon={<ION name="md-lock" style={[Styles.listIcon, { color: pallette.primary }]}/>}
                        >
                            <Text>Secret Word</Text>
                            <ION name="ios-arrow-forward" style={[Styles.listIconNav]}/>
                        </ListItem>
                        {/*Notification Settings*/}
                        <ListItem
                            onPress={() => routeHelper.goNotificationSettings(this.props.navigator)}
                            icon={<ION name="md-notifications" style={[Styles.listIcon, { color: pallette.primary }]}/>}
                        >
                            <Text>Notification Settings</Text>
                            <ION name="ios-arrow-forward" style={[Styles.listIconNav]}/>
                        </ListItem>
                    </Flex>
                </Flex>
            </Flex>
        )
    }
};

SettingsPage.propTypes = {};


module.exports = SettingsPage;