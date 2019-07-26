//propTypes: uri: RequiredString
const NativeModal = class extends React.Component {
    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.state = {}
    }

    onNavigatorEvent(event) {
        if (event.id == 'close' || event.id=='back') {
            this.props.navigator.dismissModal();
        } else {
            this.refs.webview.goBack();
        }

    }

    onNavigationStateChange = (navState) => {

        const buttons = navState.canGoBack ? {
            leftButtons: [
                {
                    icon: iconsMap['ios-arrow-back'], // for icon button, provide the local image asset name
                    id: 'back2', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                }
            ]
        } : {
            leftButtons: [
                {
                    icon: iconsMap['ios-arrow-back'], // for icon button, provide the local image asset name
                    id: 'back', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                }
            ]
        };

        this.props.navigator.setButtons(buttons);

        // this.props.navigator.setTitle({
        //     title: navState.title || this.props.title,
        //     navigatorStyle: {
        //         navBarTextColor: styleVariables.navColor,
        //         navBarButtonColor: styleVariables.navColor
        //     },
        // });

    }

    render() {
        return (
            <Flex>
                <WebView
                    onNavigationStateChange={this.onNavigationStateChange}
                    ref="webview"
                    style={{flex: 1}}
                    source={{uri: this.props.uri}}
                    scalesPageToFit={true}
                />
            </Flex>
        );
    }
};

module.exports = NativeModal;
