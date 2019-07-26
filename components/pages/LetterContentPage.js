/**
 * Created by kylejohnson on 28/01/2017.
 */
import React, {Component, PropTypes} from 'react';
import HTML from 'react-native-render-html';

const LetterContentPage = class extends Component {

    static navigatorStyle = global.navbarStyle;


    componentWillMount() {
        routeHelper.handleNavEvent(this.props.navigator, 'conditions', this.onNavigatorEvent);
    }

    onNavigatorEvent = (event) => {
        if (event.id == Constants.navEvents.SHOW) {
            Utils.recordScreenView('Letter Content Screen');
        } else if (event.id == Constants.navEvents.HIDE) {

        } else if (event.id == 'close') {
            this.props.navigator.dismissModal();
        }
    };

    render() {
        const {letter} = this.props;
        return (
            <Flex style={Styles.whiteContainer}>
                <NetworkBar/>
                <ScrollView style={[Styles.body]}>
                    <Container>
                        <H2>
                            {`Sent ${moment(letter.date).format("Do-MMM-YYYY")} by ${letter.group.name}`}
                        </H2>
                        <Text>
                            {letter.content.replace(/<BR\/>/g, "\n")}
                        </Text>
                    </Container>
                </ScrollView>
            </Flex>
        )
    }
};

LetterContentPage.propTypes = {};


module.exports = LetterContentPage;