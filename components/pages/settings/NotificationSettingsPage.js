/**
 * Created by kylejohnson on 28/01/2017.
 */
import React, {Component, PropTypes} from 'react';
import ResultsStore from '../../../common/stores/results-store';
import AlertStore from '../../../common/stores/alert-store';

const HomePage = class extends Component {

    static navigatorStyle = global.navbarStyle;

    displayName: 'HomePage'

    constructor(props, context) {
        super(props, context);
        var preferences = {};
        _.each(ResultsStore.getResultPanels(), ({ code, id }) => {
            preferences[code] = { id, value: AlertStore.getAlertValue(code) }
        });
        this.state = {
            subsriptions: {},
            isLoading: !AlertStore.model,
            panels: ResultsStore.getResultPanels(),
            preferences
        };

        ES6Component(this);
    }

    componentWillMount() {
        routeHelper.handleNavEvent(this.props.navigator, 'notification-settings', this.onNavigatorEvent);
        AppActions.getAlertInfo();
        this.listenTo(AlertStore, 'change', () => {
            this.setState({ isLoading: AlertStore.isLoading, isSaving: AlertStore.isSaving })
        });
        this.listenTo(AlertStore, 'loaded', () => {
            var preferences = {};
            _.each(this.state.panels, ({ code, id }) => {
                preferences[code] = { id, value: AlertStore.getAlertValue(code) }
            });
            this.setState({ preferences })
        });
        this.listenTo(AlertStore, 'saved', () => {
            this.setState({ hasSaved: true, isSaving:false });
        })
        this.listenTo(AlertStore, 'error', () => {
            this.setState({ isSaving:false });
        })

        //todo: maybe get a fresh set of results here
    }

    submit = () => {
        this.setState({ isSaving: true });
        AppActions.setAlertInfo(this.state.preferences);
    }

    onNavigatorEvent = (event) => {
        if (event.id == Constants.navEvents.SHOW) {
            Utils.recordScreenView('Notification Settings');
        } else if (event.id == 'close') {
            this.props.navigator.dismissModal();
        }
    };

    renderRow = ({ item }) => {

        const { heading, code, id } = item;

        return (
            <ListItem>
                <Text>{heading}</Text>
                <ReactNative.Switch
                    disabled={this.state.isSaving}

                    value={this.state.preferences[code].value}
                                    onChange={() => {
                                        this.state.preferences[code].value = !this.state.preferences[code].value;
                                        this.setState({ hasSaved: false, preferences: this.state.preferences });
                                        AppActions.setAlertInfo(code, id, this.state.preferences[code].value)
                                    }}/>
            </ListItem>
        );
    };

    search = (search) => {
        var searchLower = search.toLowerCase();
        if (!search) {
            this.setState({ search, panels: ResultsStore.getResultPanels() })
        } else {
            this.setState({
                search,
                panels: _.filter(ResultsStore.getResultPanels(), (panel) => {
                    return panel.search.indexOf(searchLower) != -1
                })
            })
        }
    }

    render() {
        const { search, hasSaved, isLoading } = this.state;
        return (
            <Flex>
                <NetworkBar
                    message="It seems you are offline, you need to be online to set your notification preferences."/>
                <View style={[Styles.greyContainer,Styles.paddedContainer]}>
                    <Text style={Styles.center}>
                        Select the result types that you would like to be notified about. An alert will be sent to your mobile device when a new result arrives.
                    </Text>
                </View>
                <FormGroup style={[Styles.greyContainer,{padding:10}]}>
                    <TextInput
                        autoCorrect={false}
                        placeholder="Search results..."
                        value={search}
                        onChangeText={this.search}
                        style={{backgroundColor:'white', marginBottom:10}}
                    />
                </FormGroup>

                {this.state.isLoading ? <Flex style={Styles.centeredContainer}><Loader/></Flex> : (
                    <FlatList
                        extraData={this.state}
                        data={this.state.panels}
                        renderItem={this.renderRow}
                    />
                )}
            </Flex>
        )
    }
};

HomePage.propTypes = {};


module.exports = HomePage;