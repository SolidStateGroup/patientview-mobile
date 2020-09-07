/**
 * Created by kylejohnson on 28/01/2017.
 */
import MessagesStore from '../../common/stores/messages-store'
import data from '../../common/data/_data'
import React, {Component, PropTypes} from 'react';
import HTML from 'react-native-render-html'

const TR = class extends Component {
    displayName: 'TheComponent'

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        const content = this.props;
        const lastMessage = content.messages[content.messages.length - 1]
        const unread = lastMessage && !_.find(lastMessage.readReceipts, (r) => {
            return r.user.id == AccountStore.getUserId()
        });
        const uri = Project.api + "conversation/" + content.id + "/user/" + lastMessage.user.id + "/picture"
        return (
            <ListItem key={content.id} onPress={() => this.props.onPress(this.props)}>
                <Image style={Styles.avatar} source={{uri, headers: {"X-Auth-Token": data.token}}}/>
                <Flex>
                    <Column>
                        <Row style={{flexWrap: "nowrap"}} space>
                            <Flex>
                                <Row>
                                    <Flex>
                                        <Text style={Styles.listItemTitle}>
                                            {content.title}
                                        </Text>
                                    </Flex>
                                    {unread && (
                                        <Column>
                                            <View style={Styles.badge}>
                                                <Text style={Styles.badgeText}>New</Text>
                                            </View>
                                        </Column>
                                    )}
                                </Row>
                                <Text style={Styles.listItemTitle} numberOfLines={1}>
                                    {_.sortBy(this.props.conversationUsers, (c) => c.user.surname).map((u) => `${u.user.forename} ${u.user.surname}`).join(", ")}
                                </Text>
                                <HTML baseFontStyle={{color: colour.textLight}}
                                      html={`${lastMessage.user.forename} ${lastMessage.user.surname}:${" "} ${Format.truncateText(Format.cleanHTML(lastMessage.message), 200)}`}/>
                            </Flex>
                        </Row>
                    </Column>
                </Flex>
                <ION name="ios-arrow-forward" style={Styles.listIconNav}/>
            </ListItem>
        );
    }
};

const MessagesPage = class extends Component {

    static navigatorStyle = global.navbarStyle;

    constructor(props, context) {
        super(props, context);
        this.state = {
            isLoading: true,
            messages: MessagesStore.model && MessagesStore.model.content
        };
    }

    componentWillMount() {
        ES6Component(this);
        AppActions.getMessages();
        routeHelper.handleNavEvent(this.props.navigator, 'messages', this.onNavigatorEvent);
        this.listenTo(MessagesStore, 'change', () => this.setState({
            isLoading: MessagesStore.isLoading,
            messages: MessagesStore.model && MessagesStore.model.content
        }));
    }

    onNavigatorEvent = (event) => {
        if (event.id == Constants.navEvents.SHOW) {
            Utils.recordScreenView('Messages Screen');
        } else if (event.id == "create") {
            routeHelper.goCreateMessage(this.props.navigator, (message) => {
                routeHelper.goMessage(this.props.navigator, message)
            })
        } else if (event.id == 'close') {
            this.props.navigator.dismissModal();
        }
    };

    onPress = (message) => {
        routeHelper.goMessage(this.props.navigator, message);
    };

    render() {
        const {isLoading, messages} = this.state;

        return (
            <Flex style={Styles.whiteContainer}>
                <NetworkBar message="It seems you are offline, you need to be online to send messages."/>
                <Flex style={[Styles.body, {padding: 20}]}>
                    <Flex>
                        {isLoading && !messages ? (
                                <Flex style={Styles.centeredContainer}>
                                    <Loader/>
                                    <Text>Loading messages</Text>
                                </Flex>
                            ) :
                            (
                                <View>
                                    {messages && messages.length && (
                                        <FormGroup style={Styles.alertSuccess}>
                                            <Text style={Styles.textCenter}>
                                                Tap on a conversation to view the full message thread.
                                            </Text>
                                        </FormGroup>
                                    ) || null}
                                    <FormGroup>
                                        <FlatList
                                            data={messages}
                                            keyExtractor={(l) => l.id}
                                            renderItem={({item}) => <TR onPress={this.onPress}
                                                                        key={item.id} {...item}/>}
                                        />
                                    </FormGroup>
                                </View>
                            )
                        }
                    </Flex>
                </Flex>
            </Flex>
        )
    }
};

MessagesPage.propTypes = {};


module.exports = MessagesPage;