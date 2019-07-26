/**
 * Created by kylejohnson on 28/01/2017.
 */
import MessageStore from '../../common/stores/message-store'
import MediaItem from '../MediaItem'
import AutoSizer from '../AutoSizer'
import data from '../../common/data/_data'
import React, {Component, PropTypes} from 'react';
import HTML from 'react-native-render-html';

const TR = class extends Component {
    displayName: 'TheComponent'

    shouldComponentUpdate(newProps) {
        if (this.props.myMedia){
            return this.props.myMedia.deleted != newProps.myMedia.deleted;
        }
        return false;
    }

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    onPress = (mediaItem) => {
        if (mediaItem.type == "IMAGE") {
            routeHelper.showImagePreview({
                uri: mediaItem.localPath,
                fallbackUri: Project.api.substring(0, Project.api.length - 1) + mediaItem.path
            });
        }
    };

    render() {
        const content = this.props;
        const user = this.props.user;
        const isYou = AccountStore.model.user.id == content.user.id;
        return (
            <Row style={isYou ? styles.chatMessageContainerYou : styles.chatMessageContainer}>
                <View style={[styles.chatMessage, isYou && styles.chatMessageYou]}>
                    {!isYou &&
                    <Text style={[styles.chatMessageText, styles.authorText]}>{user.forename} {user.surname}:</Text>}
                    <HTML onLinkPress={(e, url) => Linking.openURL(url)}
                          tagsStyles={{p: {}}}
                          html={Format.cleanHTML(unescape(content.message).replace(/\n/g, "<br/>"))}/>
                    <Text style={Styles.listSubText}>{moment(this.props.created).format("HH:mm")}</Text>
                    {content.myMedia && (
                        <AutoSizer maxWidth={DeviceWidth - 40}
                                   width={content.myMedia.width}
                                   height={content.myMedia.height}>
                            {(width, height) =>
                                <View
                                    style={{width, height:height+44}}>
                                    {content.myMedia.type == "IMAGE" ? (
                                        <TouchableOpacity
                                            activeOpacity={1}
                                            onPress={() => this.onPress(content.myMedia)}
                                            style={{flex: 1}}>
                                            <MediaItem {...content.myMedia}/>
                                        </TouchableOpacity>
                                    ) : <MediaItem {...content.myMedia}/>
                                    }
                                </View>
                            }
                        </AutoSizer>
                    )}
                </View>
            </Row>
        );
    }
};

const MessagesPage = class extends Component {

    static navigatorStyle = global.navbarStyle;

    constructor(props, context) {
        super(props, context);
        this.state = {
            isLoading: true,
            conversation: MessageStore.model && MessageStore.model[this.props.message.id]
        };
    }

    componentWillMount() {
        ES6Component(this);
        AppActions.getMessage(this.props.message.id);
        routeHelper.handleNavEvent(this.props.navigator, 'message', this.onNavigatorEvent);
        this.listenTo(MessageStore, 'change', () => this.setState({
            isLoading: MessageStore.isLoading,
            conversation: MessageStore.model[this.props.message.id]
        }));
    }


    onNavigatorEvent = (event) => {
        if (event.id == Constants.navEvents.SHOW) {
            Utils.recordScreenView('Messages Screen');
        } else if (event.id == 'close') {
            this.props.navigator.dismissModal();
        } else if (event.id == 'side-menu' && this.state.conversation) {

            var handleClick = (index) => {
                if (index == 0) {
                    routeHelper.showRecipientsModal(this.props.navigator, this.state.conversation,)
                } else if (index == 1) {

                    Alert.alert(
                        'Archive Conversation',
                        'Are you sure you want to archive this conversation?',
                        [
                            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                            {
                                text: 'OK', onPress: () => {
                                    var url = `${Project.api}user/${AccountStore.getUser().id}/conversations/${this.props.message.id}/conversationlabel/INBOX`;
                                    var url2 = `${Project.api}user/${AccountStore.getUser().id}/conversations/${this.props.message.id}/conversationlabel/ARCHIVED`;
                                    data.delete(url)
                                        .then(() => {
                                            return data.post(url2)
                                        })
                                        .then(() => {
                                            AppActions.getMessages();
                                            alert("Your conversation has been archived");
                                        })
                                }


                            },
                        ],
                        {cancelable: false}
                    );
                }
            }
            if (Platform.OS == "android") {
                ReactNative.UIManager.showPopupMenu(
                    ReactNative.findNodeHandle(this.x),
                    [`View Participants`, `Archive Conversation`],
                    null,
                    (event, index) => {
                        handleClick(index)
                    }
                )
            }
            else {
                //iOS popup
                ReactNative.ActionSheetIOS.showActionSheetWithOptions({
                    options: [`View Participants`, `Archive Conversation`, 'Cancel'],
                    destructiveButtonIndex: 1,
                    cancelButtonIndex: 2
                }, handleClick);
            }

        }
    };

    send = () => {
        Utils.record("Send Message Conversation")

        AppActions.sendMessage(this.state.message, this.props.message.id)
        this.setState({message: ""})
    };

    onViewableItemsChanged = ({viewableItems}) => {
        const top = viewableItems[viewableItems.length - 1],
            bottom = viewableItems[0];

        var showTitle;

        if (!top || !bottom)
            return

        if (top.section.title == bottom.section.title && viewableItems.length < bottom.section.data.length) {
            showTitle = bottom.section.title;
        } else {
            showTitle = ""
        }

        if (this.state.title != showTitle) {
            if (showTitle)
                this.setState({showTitle, shouldShowTitle: showTitle})
            else
                this.setState({shouldShowTitle: false})

        }

    }

    render() {
        const {isLoading, conversation} = this.state;
        return (
            <Flex style={Styles.whiteContainer}>
                {/*context menu*/}
                <ListItem
                    style={{opacity: 0, top: -35, right: 10, position: 'absolute'}}
                    ref={(x) => this.x = x}
                    View icon={<ION name="ios-stats" style={[Styles.listIcon, {color: pallette.primary}]}/>}>
                </ListItem>

                <KeyboardAvoidingView style={[Styles.body]}>
                    <Flex>
                        <NetworkBar message="It seems you are offline, you need to be online to send messages."/>
                        {isLoading && !conversation ? (
                                <Flex style={Styles.centeredContainer}>
                                    <Loader/>
                                    <Text>Loading messages</Text>
                                </Flex>
                            ) :
                            (
                                <KeyboardAvoidingView style={{flex: 1}} behavior={"padding"}
                                                      keyboardVerticalOffset={ReactNative.Platform.OS == 'android' ? -260 : 64}>
                                    {conversation && conversation.messages ? (
                                        <ReactNative.SectionList
                                            onViewableItemsChanged={this.onViewableItemsChanged}
                                            inverted={true}
                                            stickySectionHeadersEnabled={true}
                                            style={{flex: 1}}
                                            renderSectionFooter={({section}) => <Fade
                                                value={!this.state.shouldShowTitle}
                                                style={{alignSelf: 'center', padding: 10}}><Text
                                                style={Styles.textCenter}>{section.title}</Text></Fade>}
                                            sections={conversation && conversation.messages}
                                            keyExtractor={(l) => l.id}
                                            renderItem={({item}) => <TR conversationId={this.props.message.id}
                                                                        key={item.id} {...item}/>}
                                        />
                                    ) : <Flex/>}

                                    <Fade value={this.state.shouldShowTitle}
                                          style={{
                                              position: "absolute",
                                              left: 0,
                                              right: 0,
                                              alignItems: 'center',
                                              marginTop: 10
                                          }}>
                                        <View style={{
                                            padding: 6,
                                            borderRadius: 12,
                                            backgroundColor: 'rgba(255,255,255,.5)'
                                        }}>
                                            <Text>
                                                {this.state.showTitle}
                                            </Text>
                                        </View>
                                    </Fade>

                                    <Row style={{padding: 10, backgroundColor: '#f1f1f1'}}>
                                        <Flex>
                                            <TextInput
                                                style={{
                                                    padding: Platform.OS == "ios" ? 10 : 0,
                                                    backgroundColor: 'white'
                                                }}
                                                textStyle={{flex: 1, fontSize: 16}}
                                                multiline={true}
                                                minLines={0}
                                                maxLines={4}
                                                value={this.state.message}
                                                onChangeText={(message) => this.setState({message})}
                                                placeholder="Send a message..."/>
                                        </Flex>
                                        <View style={{paddingLeft: 10}}>
                                            <Button onPress={this.send} disabled={!this.state.message}
                                                    style={{height: 44, width: 70}}>
                                                Send
                                            </Button>
                                        </View>
                                    </Row>
                                </KeyboardAvoidingView>
                            )
                        }
                    </Flex>
                </KeyboardAvoidingView>
            </Flex>
        )
    }
};

MessagesPage.propTypes = {};

var
    styles = StyleSheet.create({
        chatMessageContainer: {
            justifyContent: 'flex-start',
            marginRight: DeviceWidth / 5,
            marginLeft: 10
        },
        chatMessageContainerYou: {
            justifyContent: 'flex-end',
            marginLeft: DeviceWidth / 5,
            marginRight: 10
        },
        chatMessage: {
            borderRadius: 8,
            padding: 7,
            paddingLeft: 10,
            paddingRight: 10,
            marginBottom: 10,
            backgroundColor: '#f0f0f0',
        },
        imageMessageContainer: {
            padding: 5,
            margin: 10,
            alignItems: 'center',
            borderRadius: 10
        },
        imageMessage: {
            flex: 1,
            height: 200,
            overflow: 'hidden',
            borderRadius: 10,
        },
        locationMessage: {width: DeviceWidth - 30, height: 200, flex: 1},

        chatMessageYou: {
            alignSelf: 'flex-end',
            backgroundColor: "#c7def3",
        },
        chatMessageTextYou: {
            color: colour.btnText,
        },
        chatMessageText: {
            color: pallette.primaryBlue,
        },
        authorText: {
            alignSelf: 'flex-start',
            fontSize: em(1),
            flexDirection: 'row',
        },
        scrollerContainer: {
            zIndex: 2,
            position: 'absolute',
            bottom: 20,
            right: 10,
            width: 44,
            height: 44,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 22,
            flexDirection: 'row',

        },
        scrollerIcon: {
            fontSize: em(2),
            color: '#333',
            marginTop: em(.4)
        },

        backgroundNormal: {
            backgroundColor: '#f0f0f0'
        },
        backgroundYou: {
            backgroundColor: pallette.primaryBlue,
        },
    })

module.exports = MessagesPage;