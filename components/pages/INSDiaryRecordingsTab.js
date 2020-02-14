import React, {Component, PropTypes} from 'react';

const TheComponent = class extends Component {
    static displayName = 'INSDiaryRecordingsTab';

    static navigatorStyle = global.navbarStyle;

    constructor(props, context) {
        super(props, context);
        this.state = {isLoading: true};
        if (INSDiaryRecordingsStore.model) {
            this.state = {
                recordings: INSDiaryRecordingsStore.model,
                isLoading: INSDiaryRecordingsStore.isLoading,
            };
        }
        ES6Component(this)
    }

    componentDidMount() {
        this.listenTo(INSDiaryRecordingsStore, "change", () => {
            this.setState({
                recordings: _.cloneDeep(INSDiaryRecordingsStore.model),
                isLoading: INSDiaryRecordingsStore.isLoading,
            });
        });
        AppActions.getINSDiaryRecordings();
    }

    onNavigatorEvent = (event) => {
        if (event.id == Constants.navEvents.SHOW) {
            Utils.recordScreenView('INS Diary Recording Tab');
        }
        if (event.id == 'close') {
            this.props.navigator.dismissModal();
        }
    };

    onEndReached = () => {
        if (!INSDiaryRecordingsStore.hasMoreRecordings()) return;
        AppActions.getMoreINSDiaryRecordings();
    }

    deleteRecording = (id) => {
        Alert.alert(
            'Confirm',
            'Are you sure you want to delete this INS diary record?',
            [
                {text: 'Cancel', style: 'cancel'},
                {
                    text: 'OK', onPress: () => {
                        AppActions.deleteINSDiaryRecording(id);
                    }
                },
            ],
        );
    }

    renderRow = ({item}) => {
        const {entryDate, dipstickType, inRelapse, id} = item;
        return (
            <Row style={[Styles.insDiaryListItem, Styles.mb20]}>
                <Flex>
                    <Row>
                        <Flex>
                            <Column>
                                <Text style={Styles.bold}>Date</Text>
                                <Text>{moment(entryDate).format('DD-MMM-YYYY')}</Text>
                            </Column>
                        </Flex>
                        <Flex>
                            <Column>
                                <Text style={Styles.bold}>Time</Text>
                                <Text>{moment(entryDate).format('HH:mm')}</Text>
                            </Column>
                        </Flex>
                    </Row>
                    <Row style={[Styles.mt10, Styles.alignStart]}>
                        <Flex>
                            <Column>
                                <Text style={Styles.bold}>Urine Protein Dipstick</Text>
                            </Column>
                        </Flex>
                        <Flex>
                            <Column>
                                <Text style={Styles.bold}>Relapse</Text>
                            </Column>
                        </Flex>
                    </Row>
                    <Row>
                        <Flex>
                            <Column>
                                <Text>{Constants.urineProteinDipstick[dipstickType] || ''}</Text>
                            </Column>
                        </Flex>
                        <Flex>
                            <Column>
                                <Text>{inRelapse ? 'Yes' : 'No'}</Text>
                            </Column>
                        </Flex>
                    </Row>
                </Flex>
                <Column>
                    <Row>
                        <TouchableOpacity style={Styles.buttonIcon} onPress={() => routeHelper.goINSDiaryRecording(this.props.navigator, item, true)}>
                            <FontAwesome style={[Styles.listItemIcon, {color: pallette.primary}]} name="pencil-square-o"/>
                        </TouchableOpacity>
                        <TouchableOpacity style={[Styles.buttonIcon, Styles.ml10, {paddingBottom: 4}]} onPress={() => this.deleteRecording(id)}>
                            <FontAwesome style={[Styles.listItemIcon, {color: colour.danger}]} name="trash"/>
                        </TouchableOpacity>
                    </Row>
                </Column>
            </Row>
        );
    }

    render() {
        const {isLoading, recordings} = this.state;
        const { addEntry } = this.props;
        const mostRecentRecording = INSDiaryRecordingsStore.getMostRecentRecording();
        return isLoading ?
            <Flex>
                <NetworkBar message="It seems you are offline, you need to be online to record an INS diary entry."/>
                <View style={Styles.centeredContainer}>
                    <Loader/>
                </View>
            </Flex>
            : (
                <Flex style={Styles.whiteContainer}>
                    <NetworkBar message="It seems you are offline, you need to be online to record an INS diary entry."/>

                    <Row style={[Styles.mt10, Styles.alignCenter]}><Image source={require('../../images/nest-logo.png')} style={Styles.insLogo} /></Row>

                    <Fade style={{flex: 1}} autostart value={true}>
                        <Flex style={Styles.container}>
                            <FormGroup>
                                <Column>
                                    <Button style={Styles.mb10} onPress={() => routeHelper.goINSDiaryRecording(this.props.navigator, mostRecentRecording ? { inRelapse: mostRecentRecording.inRelapse, relapse: mostRecentRecording.relapse } : null)}>
                                        Add
                                    </Button>
                                </Column>
                            </FormGroup>
                            {recordings && !!recordings.length ? (
                                <FlatList
                                    keyExtractor={item => item.id}
                                    data={recordings || []}
                                    renderItem={this.renderRow}
                                    onEndReached={this.onEndReached}
                                />
                            ) : (
                                <Text style={Styles.center}>
                                    You have no INS diary recordings
                                </Text>
                            )}
                        </Flex>
                    </Fade>
                </Flex>
            );
    }
};

TheComponent.propTypes = {};

export default TheComponent;
