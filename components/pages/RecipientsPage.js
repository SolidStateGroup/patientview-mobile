/**
 * Created by kylejohnson on 28/01/2017.
 */
import React, {Component, PropTypes} from 'react';
import HTML from 'react-native-render-html';
import data from '../../common/data/_data'
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
                <FlatList
                    data={this.props.conversation.conversationUsers}
                    keyProvider={(l) => l.id}
                    renderItem={({item}) => {
                        const uri = Project.api + "conversation/" + this.props.conversation.id + "/user/" + item.user.id + "/picture"
                        return (
                            <ListItem>
                                <View>
                                    <Row>
                                        <Image style={Styles.avatar} source={{uri, headers: {"X-Auth-Token": data.token}}}/>
                                        <Column>
                                            <Text style={Styles.listItemTitle}>
                                                {item.user.forename} {item.user.surname}
                                            </Text>
                                        </Column>
                                    </Row>
                                </View>
                            </ListItem>
                        )
                    }}/>
            </Flex>
        )
    }
};

LetterContentPage.propTypes = {};


module.exports = LetterContentPage;