/**
 * Created by kylejohnson on 28/01/2017.
 */
//UNUSED
import React, {Component, PropTypes} from 'react';
const ConditionsPage = class extends Component {

    static navigatorStyle = global.navbarStyle;
    
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    componentWillMount() {
        routeHelper.handleNavEvent(this.props.navigator, 'conditions', this.onNavigatorEvent);
    }

    onNavigatorEvent = (event) => {
        if (event.id == Constants.navEvents.SHOW) {
            Utils.recordScreenView('Conditions Screen');
        } else if (event.id == Constants.navEvents.HIDE) {

        } else if (event.id == 'close') {
            this.props.navigator.dismissModal();
        }
    };

    render() {
        return (
            <Flex style={Styles.whiteContainer}>
                <NetworkBar/>
                <Flex style={[Styles.body,{padding:20}]}>
                    <Flex>

                    </Flex>
                </Flex>
            </Flex>
        )
    }
};

ConditionsPage.propTypes = {};


module.exports = ConditionsPage;