import React, {Component, PropTypes} from 'react';
import PhotoView from 'react-native-photo-view';
import data from "../../common/data/_data";

const TheComponent = class extends Component {
    static navigatorStyle = global.navbarStyle
    displayName: 'TheComponent'
    componentWillMount() {
        routeHelper.handleNavEvent(this.props.navigator, 'message', this.onNavigatorEvent);
    }
    onNavigatorEvent = (event) => {
        if (event.id == Constants.navEvents.SHOW) {
            Utils.recordScreenView("Image Preview");
        } else if(event.id =="close"){
            this.props.navigator.dismissModal()
        }
    };


    render() {
        var source = {
            headers: {
                Pragma: 'no-cache',
                "X-Auth-Token": data.token
            }
        };

        return (
            <Flex style={Styles.whiteContainer}>
                <LocalAssetProvider uri={this.props.uri}
                                    fallbackUri={this.props.fallbackUri}>
                    {(isLoading, uri) => !isLoading && (
                        <PhotoView
                            resizeMode={"contain"}
                            style={{flex: 1}}
                            source={Object.assign({}, source, {uri})}
                        />
                    )}
                </LocalAssetProvider>
            </Flex>
        );
    }
};

TheComponent.propTypes = {};

module.exports = TheComponent;