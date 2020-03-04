import React, {Component, PropTypes} from 'react';

const TheComponent = class extends Component {
    static displayName = 'HospitalisationsTab';

    static navigatorStyle = global.navbarStyle;

    constructor(props, context) {
        super(props, context);
        this.state = {isLoading: true};
        if (HospitalisationsStore.model) {
            this.state = {
                hospitalisations: HospitalisationsStore.model,
                isLoading: HospitalisationsStore.isLoading,
            };
        }
        ES6Component(this)
    }

    componentDidMount() {
        this.listenTo(HospitalisationsStore, "change", () => {
            this.setState({
                hospitalisations: _.cloneDeep(HospitalisationsStore.model),
                isLoading: HospitalisationsStore.isLoading,
            });
        });
        AppActions.getINSHospitalisations();
    }

    onNavigatorEvent = (event) => {
        if (event.id == Constants.navEvents.SHOW) {
            Utils.recordScreenView('INS Hospitalisations Tab');
        }
        if (event.id == 'close') {
            this.props.navigator.dismissModal();
        }
    };

    deleteHospitalisation = (id) => {
        Alert.alert(
            'Confirm',
            'Are you sure you want to delete this hospitalisation record?',
            [
                {text: 'Cancel', style: 'cancel'},
                {
                    text: 'OK', onPress: () => {
                        AppActions.deleteINSHospitalisation(id);
                    }
                },
            ],
        );
    }

    renderRow = ({item}) => {
        const {dateAdmitted, reason, dateDischarged, id} = item;
        return (
            <Row style={[Styles.insDiaryListItem, Styles.mb20]}>
                <Flex>
                    <Row style={Styles.alignStart}>
                        <Flex>
                            <Column>
                                <Text style={Styles.bold}>Hospitalisation Date</Text>
                            </Column>
                        </Flex>
                        <Flex>
                            <Column>
                                <Text style={Styles.bold}>Discharge Date</Text>
                            </Column>
                        </Flex>
                    </Row>
                    <Row>
                        <Flex>
                            <Column>
                                <Text>{moment(dateAdmitted).format('MMM D, YYYY')}</Text>
                            </Column>
                        </Flex>
                        <Flex>
                            <Column>
                                <Text>{dateDischarged ? moment(dateDischarged).format('MMM D, YYYY') : '(Ongoing)'}</Text>
                            </Column>
                        </Flex>
                    </Row>
                    <Row style={Styles.mt10}>
                        <Flex>
                            <Column>
                                <Text style={Styles.bold}>Reason</Text>
                                <Text>{reason}</Text>
                            </Column>
                        </Flex>
                    </Row>
                </Flex>
                <Column>
                    <Row>
                        <TouchableOpacity style={Styles.buttonIcon} onPress={() => routeHelper.goINSHospitalisation(this.props.navigator, item)}>
                            <FontAwesome style={[Styles.listItemIcon, {color: pallette.primary}]} name="pencil-square-o"/>
                        </TouchableOpacity>
                        <TouchableOpacity style={[Styles.buttonIcon, Styles.ml10, {paddingBottom: 4}]} onPress={() => this.deleteHospitalisation(id)}>
                            <FontAwesome style={[Styles.listItemIcon, {color: colour.danger}]} name="trash"/>
                        </TouchableOpacity>
                    </Row>
                </Column>
            </Row>
        );
    }

    render() {
        const {isLoading, hospitalisations} = this.state;
        return isLoading ?
            <Flex>
                <NetworkBar message="It seems you are offline, you need to be online to record a hospitalisation."/>
                <View style={Styles.centeredContainer}>
                    <Loader/>
                </View>
            </Flex>
            : (
                <Flex style={Styles.whiteContainer}>
                    <NetworkBar message="It seems you are offline, you need to be online to record a hospitalisation."/>

                    <Fade style={{flex: 1}} autostart value={true}>
                        <Flex style={Styles.container}>
                            <FormGroup>
                                <Column>
                                    <Button style={Styles.mb10} onPress={() => routeHelper.goINSHospitalisation(this.props.navigator)}>
                                        Add
                                    </Button>
                                </Column>
                            </FormGroup>
                            {hospitalisations && !!hospitalisations.length ? (
                                <FlatList
                                    keyExtractor={item => item.id}
                                    data={hospitalisations || []}
                                    renderItem={this.renderRow}
                                />
                            ) : (
                                <Text style={Styles.center}>
                                    No hospitalisation records found
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
