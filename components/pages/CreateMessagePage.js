/**
 * Created by kylejohnson on 28/01/2017.
 */
import React, {Component, PropTypes} from 'react';
import data from '../../common/data/_data'
const ConditionsPage = class extends Component {

    static navigatorStyle = global.navbarStyle;

    constructor(props, context) {
        super(props, context);
        this.state = {isLoading: true};
    }

    componentWillMount() {
        routeHelper.handleNavEvent(this.props.navigator, 'conditions', this.onNavigatorEvent);
        data.get(`${Project.api}user/${AccountStore.getUserId()}/messaginggroups`)
            .then((groups)=> {
                groups = groups.map((g)=>Object.assign({}, g, {search: g.name.toLowerCase()}));
                this.setState({
                    isLoading: false,
                    groups,

                })
            })
    }

    selectGroup = (group) => {
        if (!group)
            return this.setState({group: null})
        this.setState({isLoading: true})
        data.get(`${Project.api}user/${AccountStore.getUserId()}/conversations/recipients?groupId=${group.id}`)
            .then((particpants)=> {
                var x = particpants.match(/<option.*?<\/option>/g)
                var res = _.filter(x.map((str)=> {
                    var x = str.search(/value=.(\d+)/)
                    if (x == -1)
                        return null
                    var name = str.split(/[<>]/g)[2];
                    return {
                        id: str.split('"')[1],
                        name,
                        search: name.toLowerCase()
                    }
                }), (i)=>i)
                this.setState({group, participants: res, isLoading: false})
            })
    }

    onNavigatorEvent = (event) => {
        if (event.id == Constants.navEvents.SHOW) {
            Utils.recordScreenView('Conditions Screen');
        } else if (event.id == Constants.navEvents.HIDE) {

        } else if (event.id == 'close') {
            this.props.navigator.dismissModal();
        }
    };

    submit = ()=> {
        this.setState({isSaving: true});
        var body = {
            open: true,
            messages: [{
                user: {id: AccountStore.getUserId()},
                message: this.state.message,
                type: "MESSAGE"
            }],
            conversationUsers: this.state.selectedParticipants.map((u)=> {
                return {
                    user: {id: u.id},
                    anonymous: false
                }
            }).concat([{user: {id: AccountStore.getUserId()}, anonymous: false}]),
            title: this.state.title,
            type: "MESSAGE",

        };
        data.post(`${Project.api}user/${AccountStore.getUserId()}/conversations`, body)
            .then(()=> {
                Utils.record("Create New Conversation")
                AppActions.getMessages()
                this.props.navigator.dismissModal();
            })
    }

    renderParticipant = (item, isSelected, toggleItem) => {
        return (
            <ListItem onPress={toggleItem}>
                <Text>{item.name}</Text>
                <ION style={[Styles.listIcon, {color: isSelected ? colour.primary : colour.listItemNav}]}
                     name={isSelected ? "ios-checkbox" : "ios-checkbox-outline"}/>
            </ListItem>
        )
    }
    renderGroup = (item, isSelected, toggleItem) => {
        return (
            <ListItem onPress={toggleItem}>
                <Text>{item.name}</Text>
                <ION style={[Styles.listIcon, {color: isSelected ? colour.primary : colour.listItemNav}]}
                     name={isSelected ? "ios-checkbox" : "ios-checkbox-outline"}/>
            </ListItem>
        )
    }
    showParticipants = ()=> {
        routeHelper.openSelect(this.props.navigator, "Select Participants", {
            items: this.state.participants,
            filterText: "Please select the recipient(s) of this message:",
            value: _.cloneDeep(this.state.selectedParticipants),
            placeholder: "Search for recipient...",
            renderRow: this.renderParticipant,
            onChange: (selectedParticipants)=>this.setState({selectedParticipants}),
            multiple: true,
            filterItem: (i, search)=> i.search.indexOf(search) != -1
        })
    }


    showGroups = ()=> {
        routeHelper.openSelect(this.props.navigator, "Select Group", {
            items: this.state.groups,
            placeholder: "Search for group...",
            filterText: "Please tick the group that the recipient belongs to:",
            value: _.cloneDeep(this.state.group),
            renderRow: this.renderGroup,
            onChange: this.selectGroup,
            multiple: false,
            filterItem: (i, search)=> i.search.indexOf(search) != -1
        })
    }

    render() {
        const {group, selectedParticipants} = this.state;
        const disabledParticipants = !this.state.group;
        return (
            <Flex style={Styles.whiteContainer}>
                <NetworkBar message="It seems you are offline, you need to be online to create a conversation."/>
                <Flex style={[Styles.body, {padding: 20}]}>
                    <KeyboardAvoidingView style={{flex: 1}} behavior={"padding"}
                                          keyboardVerticalOffset={ReactNative.Platform.OS == 'android' ? -260 : 100}>
                        <Fade style={{flex: 1}} autostart={1} value={1}>
                            <ScrollView>
                                <FormGroup>
                                    <H2>Group*</H2>
                                </FormGroup>
                                <FormGroup>
                                    <SelectBox onPress={this.showGroups}>
                                        {group ? group.name : "Select a group"}
                                    </SelectBox>
                                </FormGroup>
                                <View style={{opacity: disabledParticipants ? 0.5 : 1}}>
                                    <FormGroup>
                                        <H2>Recipients*</H2>
                                    </FormGroup>
                                    <FormGroup>
                                        <SelectBox disabled={disabledParticipants} onPress={this.showParticipants}>
                                            {selectedParticipants && selectedParticipants.length ? (
                                                this.state.selectedParticipants.map((p)=>`${p.name}`).join(",")
                                            ) : "Select recipients..."}
                                        </SelectBox>
                                    </FormGroup>

                                    <FormGroup>
                                        <H2>Title*</H2>
                                        <TextInput onChangeText={(title)=>this.setState({title})}
                                                   value={this.state.title}/>
                                    </FormGroup>
                                    <FormGroup>
                                    </FormGroup>
                                    <H2>Message*</H2>
                                    <TextInput
                                        multiline={true} textStyle={{flex: 1}} minLines={5} maxLines={10}
                                               onChangeText={(message)=>this.setState({message})}
                                               value={this.state.message}/>
                                </View>
                            </ScrollView>

                            <FormGroup>
                                <Button onPress={this.submit}
                                        disabled={this.state.saving || !this.state.title || !this.state.message || (!this.state.selectedParticipants || !this.state.selectedParticipants.length)}>
                                    {this.state.saving ? "Creating Conversation..." : "Create Conversation"}
                                </Button>
                            </FormGroup>
                        </Fade>
                    </KeyboardAvoidingView>
                </Flex>
            </Flex>
        )
    }
};

ConditionsPage.propTypes = {};


var x = {
    "type": "MESSAGE",
    "title": "Test",
    "messages": [{"user": {"id": 98217}, "message": "Test"}],

    "open": true,
    "conversationUsers": [{"user": {"id": 99458}, "anonymous": false}],
}

var y = {
    "type": "MESSAGE",
    "title": "New Message",
    "messages": [{"user": {"id": 98217}, "message": "Test", "type": "MESSAGE"}],
    "open": true,
    "conversationUsers": [{"user": {"id": "23323514"}, "anonymous": false}, {
        "user": {"id": "100997"},
        "anonymous": false
    }, {"user": {"id": "99924"}, "anonymous": false}, {"user": {"id": 98217}, "anonymous": false}]
}


module.exports = ConditionsPage;