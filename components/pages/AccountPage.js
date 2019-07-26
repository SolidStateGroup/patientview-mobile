/**
 * Created by kylejohnson on 28/01/2017.
 */
import React, {Component, PropTypes} from 'react';
import AccountStore from '../../common/stores/account-store';
import ResultsStore from '../../common/stores/results-store';
import MediaStore from '../../common/stores/media-store';
import MedicineStore from '../../common/stores/medicines-store';
import ResultStore from '../../common/stores/result-store'; // DO NOT REMOVE, used for load results to work
import StateStore from '../../common/stores/device-state-store'; // DO NOT REMOVE, used for load results to work
import StatsStore from '../../common/stores/stats-store'; // DO NOT REMOVE, used for load results to work
var listened = false;
import data from '../../common/data/_data';
import NetworkStore from '../../common/stores/network-store';

var gotInitialNotification = false;
const AccountPage = class extends Component {
    static navigatorStyle = global.navbarStyle;

    constructor(props, context) {
        super(props, context);
        this.state = {
            isLoading: !ResultsStore.getResultsSummary(),
            unreadCount: StatsStore.getUnreadMessages(),
            lettersCount: StatsStore.getLettersCount(),
            medicinesCount: StatsStore.getMedicinesCount(),
            summaries: ResultsStore.getResultsSummary()
        };

        ES6Component(this);
    }

    componentWillMount() {
        this.listenTo(NetworkStore, 'change', () => {
            this.forceUpdate();
        })

        routeHelper.handleNavEvent(this.props.navigator, 'account', this.onNavigatorEvent);
        API.push.init((res) => {
            if (res.conversationId && res.opened_from_tray) {
                routeHelper.goMessage(this.props.navigator, {id: res.conversationId, title: res.conversationTitle})
            }
        }).then((token) => {
            API.push.subscribe('/topics/' + AccountStore.getUserId() + Project.topic);
            API.push.subscribe('/topics/' + AccountStore.getUserId() + Project.topicMessages);
            this.setState({token})
        });

        if (!gotInitialNotification) {
            API.push.getInitialNotification()
                .then((res) => {
                    if (res.conversationId) {
                        setTimeout(() => {
                            routeHelper.goMessage(this.props.navigator, {
                                id: res.conversationId,
                                title: res.conversationTitle
                            })
                        }, Platform.OS == "ios" ? 100 : 2000)
                    }
                })
            gotInitialNotification = true;
        }

    }

    onNavigatorEvent = (event) => {
        if (event.id == Constants.navEvents.SHOW) {
            dismissKeyboard();
            Utils.recordScreenView('Account');
        } else if (event.id == Constants.navEvents.HIDE) {

        } else if (event.id == 'side-menu') {
            //Android popup
            if (Platform.OS == "android" && this.x) {
                ReactNative.UIManager.showPopupMenu(
                    ReactNative.findNodeHandle(this.x),
                    [`Settings`, `Logout`],
                    null,
                    (event, index) => {
                        if (index == 0) {
                            routeHelper.goSettings(this.props.navigator);
                        } else if (index == 1) {
                            Alert.alert(
                                'Confirm Logout',
                                'If you logout you will not receive any mobile notifications that you have subscribed for. Do you wish to continue?',
                                [
                                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                    {text: 'OK', onPress: () => routeHelper.logout(this.props.navigator)},
                                ],
                                {cancelable: false}
                            );
                        }
                    }
                )
            }
            else {
                //iOS popup
                ReactNative.ActionSheetIOS.showActionSheetWithOptions({
                        options: [`Settings`, 'Logout', 'Cancel'],
                        destructiveButtonIndex: 1,
                        cancelButtonIndex: 2
                    },
                    function (index) {
                        if (index == 0) {
                            routeHelper.goSettings(this.props.navigator);
                        } else if (index == 1) {
                            Alert.alert(
                                'Confirm Logout',
                                'If you logout you will not receive any mobile notifications that you have subscribed for. Do you wish to continue?',
                                [
                                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                    {text: 'OK', onPress: () => routeHelper.logout(this.props.navigator)},
                                ],
                                {cancelable: false}
                            );

                        }
                    }.bind(this));
            }

        }

        if (!listened) { //one time globally, listen to unauthorised and logout user
            listened = true
            this.listenTo(AccountStore, 'unauthorized', () => {
                //Log user out on any 403 errors
                if (AccountStore.getUserId()) {
                    API.push.unsubscribe('/topics/' + AccountStore.getUserId() + Project.topic);
                    API.push.unsubscribe('/topics/' + AccountStore.getUserId() + Project.topicMessage);
                    AccountStore.getUserId().id = null;
                    setTimeout(() => {
                        routeHelper.logout(this.props.navigator)
                    }, 1000)
                }
            });
        }

    };

    logout = () => {
        routeHelper.logout(this.props.navigator);
    };

    componentDidMount = () => {
        if (!AccountStore.hasSecretWord() || Constants.simulate.NO_SECRET_WORD) {
            //Force new users to enter a secret word
            routeHelper.openSetSecretWord(this.props.navigator);
        }
        this.listenTo(ResultsStore, 'change', () => {
            this.setState({
                unreadCount: ResultsStore.getUnreadCount(),
                isLoading: ResultsStore.isLoading,
                summaries: ResultsStore.getResultsSummary()
            });
        });
        this.listenTo(StatsStore, 'change', () => {
            this.setState({
                unreadCount: StatsStore.getUnreadMessages(),
                lettersCount: StatsStore.getLettersCount(),
                medicinesCount: StatsStore.getMedicinesCount(),
            });
        });
        AppActions.getResultsSummary();
        AppActions.getStats();
    };

    render() {
        console.log(this.props);

        if (!AccountStore.model) { //Prevent unnecessary re-render if the user gets logged out
            return <View/>
        }

        const {summaries} = this.state;
        const user = AccountStore.getUser();
        const name = Constants.simulate.SCREENSHOT ? "Test User" : (user.forename || "") + " " + (user.surname || "");
        const identifiers = Constants.simulate.SCREENSHOT ? [
            {
                identifierType: {description: "CHI Number"},
                identifier: "1234567"
            },  {
                identifierType: {description: "NHS Number"},
                identifier: "1234567"
            }, ] : AccountStore.getIdentifiers();
        const showNewBadge = !this.state.isLoading && ResultsStore.hasNewResults();
        const hasLatestResult = summaries && summaries.latestObservationDate ? true : false;
        const showNewLetterBadge = true;
        const uri = Constants.simulate.SCREENSHOT ? "https://images.vexels.com/media/users/3/129733/isolated/preview/a558682b158debb6d6f49d07d854f99f-casual-male-avatar-silhouette-by-vexels.png" : Project.api + "user/" + user.id + "/picture?token=" + data.token


        return (
            <Flex>
                <NetworkBar
                    message="It seems you are offline, your data will automatically sync when you go back online."/>

                <Flex>

                    {/*context menu*/}
                    <ListItem
                        style={{opacity: 0, top: -35, right: 10, position: 'absolute'}}
                        ref={(x) => this.x = x}
                        View icon={<ION name="ios-stats" style={[Styles.listIcon, {color: pallette.primary}]}/>}>
                    </ListItem>

                    <ListItem style={[Styles.greyContainer, Styles.paddedContainer]}
                              icon={<CachedImage source={{uri}} style={[Styles.avatar, {color: pallette.primary}]}/>}>
                        <Column>
                            <H2>
                                {name}
                            </H2>
                            {/*Patient ids - NHS etc*/}
                            <View>
                                {identifiers.map((i) => (
                                    <Text key={i} style={{fontSize: 10.5}}>
                                        {i.identifierType.description} - {i.identifier}
                                    </Text>
                                ))}
                            </View>
                        </Column>

                        <Column>
                            <TouchableOpacity
                                onPress={() => routeHelper.goMessages(this.props.navigator)}>
                                <View style={{alignItems: 'center'}}>
                                    <ION name="ios-chatbubbles"
                                         style={[Styles.listIcon, {
                                             color: pallette.primary,
                                             marginRight: 0,
                                             marginBottom: -4
                                         }]}>
                                    </ION>
                                    {this.state.unreadCount ? (
                                        <View style={{
                                            backgroundColor: colour.brandDanger,
                                            position: "absolute",
                                            top: 0,
                                            left: 17,
                                            width: 18,
                                            height: 18,
                                            borderRadius: 9,
                                            alignItems: "center",
                                            centeredContainer: "center"
                                        }}>
                                            <Text style={[Styles.buttonText, {marginTop: 1, fontSize: em(1)}]}>
                                                {this.state.unreadCount}
                                            </Text>
                                        </View>
                                    ) : null}
                                    <Text style={[Styles.listSubText, {paddingTop: 0}]}>Messages</Text>
                                </View>
                            </TouchableOpacity>
                        </Column>
                    </ListItem>


                    <Flex style={{padding: 20, borderRadius: 8, overflow: 'hidden', backgroundColor: 'white'}}>
                        {/*Conditions*/}
                        {/*<ListItem*/}
                        {/*icon={<ION name="ios-stats" style={[Styles.listIcon, {color: pallette.primary}]}/>}*/}
                        {/*onPress={() => routeHelper.goConditions(this.props.navigator)}>*/}
                        {/*<View>*/}
                        {/*<Row>*/}
                        {/*<Text style={Styles.listItemTitle}>My Conditions</Text>*/}
                        {/*{this.state.isLoading && <Loader/>}*/}
                        {/*</Row>*/}

                        {/*<Text style={Styles.listSubText}>*/}
                        {/*2 diagnoses*/}
                        {/*</Text>*/}
                        {/*</View>*/}
                        {/*<ION name="ios-arrow-forward" style={[Styles.listIconNav]}/>*/}
                        {/*</ListItem>*/}


                        {/*Results*/}
                        <ListItem
                            icon={<ION name="ios-stats" style={[Styles.listIcon, {color: pallette.primary}]}/>}
                            onPress={() => routeHelper.goResults(this.props.navigator)}>
                            <View>
                                <Row>
                                    <Text style={Styles.listItemTitle}>Results</Text>

                                    {this.state.isLoading && <Loader/>}

                                    {
                                        showNewBadge && hasLatestResult && (
                                            <Column>
                                                <View style={Styles.badge}>
                                                    <Text style={Styles.badgeText}>New</Text>
                                                </View>
                                            </Column>
                                        )
                                    }
                                </Row>

                                {hasLatestResult && (
                                    <Text style={Styles.listSubText}>
                                        Latest: {Format.dateAndTime(summaries.latestObservationDate)}
                                    </Text>
                                )}
                            </View>
                            <ION name="ios-arrow-forward" style={[Styles.listIconNav]}/>
                        </ListItem>

                        {/*Medicines*/}
                        <ListItem
                            icon={<ION name="md-medkit" style={[Styles.listIcon, {color: pallette.primary}]}/>}
                            onPress={() => routeHelper.goMedicines(this.props.navigator)}>
                            <View>
                                <Row>
                                    <Text style={Styles.listItemTitle}>Medicines</Text>
                                    {this.state.isLoading && <Loader/>}
                                </Row>

                                {!this.state.isLoading && (
                                    <Text style={Styles.listSubText}>
                                        {this.state.medicinesCount} medicines
                                    </Text>
                                )}

                            </View>
                            <ION name="ios-arrow-forward" style={[Styles.listIconNav]}/>
                        </ListItem>


                        {/*Letters*/}
                        <ListItem
                            icon={<ION name="ios-document" style={[Styles.listIcon, {color: pallette.primary}]}/>}
                            onPress={() => routeHelper.goLetters(this.props.navigator)}>
                            <View>
                                <Row>
                                    <Text style={Styles.listItemTitle}>Letters</Text>
                                    {this.state.isLoading && <Loader/>}
                                </Row>

                                {!this.state.isLoading && (
                                    <Text style={Styles.listSubText}>
                                        {this.state.lettersCount} letters
                                    </Text>
                                )}

                            </View>
                            <ION name="ios-arrow-forward" style={[Styles.listIconNav]}/>
                        </ListItem>

                        {/*Enter Results*/}
                        <ListItem
                            icon={<FontAwesome name="pencil-square-o"
                                               style={[Styles.listIcon, {color: pallette.primary}]}/>}
                            onPress={() => routeHelper.goEnterResults(this.props.navigator)}>
                            <View>
                                <Row>
                                    <Text style={Styles.listItemTitle}>Enter Own Data</Text>
                                </Row>
                            </View>
                            <ION name="ios-arrow-forward" style={[Styles.listIconNav]}/>
                        </ListItem>

                        {/*/!*Media*!/*/}
                        <ListItem
                            icon={<ION name="md-image" style={[Styles.listIcon, {color: pallette.primary}]}/>}
                            onPress={() => routeHelper.goMedia(this.props.navigator)}>
                            <View>
                                <Row>
                                    <Text style={Styles.listItemTitle}>Media</Text>
                                    {/*{this.state.isLoading && <Loader/>}*/}
                                </Row>

                                {/*{!this.state.isLoading && (*/}
                                {/*<Text style={Styles.listSubText}>*/}
                                {/*{this.state.medicinesCount} medicines*/}
                                {/*</Text>*/}
                                {/*)}*/}

                            </View>
                            <ION name="ios-arrow-forward" style={[Styles.listIconNav]}/>
                        </ListItem>

                        {/*Settings*/}
                        <ListItem
                            icon={<ION name="ios-cog" style={[Styles.listIcon, {color: pallette.primary}]}/>}
                            onPress={() => routeHelper.goSettings(this.props.navigator)}>
                            <View>
                                <Row>
                                    <Text style={Styles.listItemTitle}>Settings</Text>
                                </Row>
                            </View>
                            <ION name="ios-arrow-forward" style={[Styles.listIconNav]}/>
                        </ListItem>
                    </Flex>
                </Flex>
            </Flex>
        )
    }
};

AccountPage.propTypes = {};
module.exports = AccountPage;