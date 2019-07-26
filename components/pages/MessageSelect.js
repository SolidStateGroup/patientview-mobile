/**
 * Created by kylejohnson on 28/01/2017.
 */
import MessagesStore from '../../common/stores/messages-store'
import React, {Component, PropTypes} from 'react';
import HTML from 'react-native-render-html'

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
            Utils.recordScreenView('Message Select Screen');
        } else if (event.id == 'close') {
            this.props.navigator.dismissModal();
        }
    };

    onPress = () => {
        this.props.onSelect && this.props.onSelect(this.state.value);
        this.props.navigator.dismissModal();
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
                                <Flex>
                                    {messages && messages.length && (
                                        <Select
                                            find={(item, value) => {
                                                return _.find(value, {id: item.id})
                                            }}
                                            placeholder={this.props.placeholder || "Search"}
                                            items={messages}
                                            value={this.state.value}
                                            onChange={(value) => this.setState({value})}
                                            multiple={false}
                                            renderRow={(item, isSelected, toggleItem) => {
                                                const lastMessage = item.messages[item.messages.length - 1]

                                                return (
                                                    <ListItem style={Styles.listItem} onPress={toggleItem}>
                                                        <Flex style={{marginRight: 10}}>
                                                            <Text style={Styles.listItemText}>
                                                                {item.title}
                                                            </Text>
                                                            <Text style={Styles.listItemTitle} numberOfLines={1}>
                                                                {_.sortBy(item.conversationUsers, (c) => c.user.surname).map((u) => `${u.user.forename} ${u.user.surname}`).join(", ")}
                                                            </Text>
                                                            <HTML baseFontStyle={{color: colour.textLight}}
                                                                  html={`${lastMessage.user.forename} ${lastMessage.user.surname}:${" "} ${Format.truncateText(Format.cleanHTML(lastMessage.message), 200)}`}/>
                                                        </Flex>
                                                        <ION
                                                            style={[Styles.listIcon, isSelected && {color: colour.primary}]}
                                                            name="ios-checkbox"/>
                                                    </ListItem>
                                                )
                                            }}
                                            filterItem={this.filterItem}
                                        />
                                    ) || null}

                                    <Button onPress={this.onPress} disabled={!this.state.value}>
                                        Confirm
                                    </Button>
                                </Flex>
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