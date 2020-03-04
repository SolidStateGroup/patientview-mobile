import React, {Component, PropTypes} from 'react';

const TheComponent = class extends Component {
    static displayName = 'ImmunisationsTab';

    static navigatorStyle = global.navbarStyle;

    constructor(props, context) {
        super(props, context);
        this.state = {isLoading: true};
        if (ImmunisationsStore.model) {
            this.state = {
                immunisations: ImmunisationsStore.model,
                isLoading: ImmunisationsStore.isLoading,
            };
        }
        ES6Component(this)
    }

    componentDidMount() {
        this.listenTo(ImmunisationsStore, "change", () => {
            this.setState({
                immunisations: _.cloneDeep(ImmunisationsStore.model),
                isLoading: ImmunisationsStore.isLoading,
            });
        });
        AppActions.getINSImmunisations();
    }

    onNavigatorEvent = (event) => {
        if (event.id == Constants.navEvents.SHOW) {
            Utils.recordScreenView('INS Immunisations Tab');
        }
        if (event.id == 'close') {
            this.props.navigator.dismissModal();
        }
    };

    deleteImmunisation = (id) => {
        Alert.alert(
            'Confirm',
            'Are you sure you want to delete this immunisation record?',
            [
                {text: 'Cancel', style: 'cancel'},
                {
                    text: 'OK', onPress: () => {
                        AppActions.deleteINSImmunisation(id);
                    }
                },
            ],
        );
    }

    renderRow = ({item}) => {
        const {immunisationDate, codelist, other, id} = item;
        return (
            <Row style={[Styles.insDiaryListItem, Styles.mb20]}>
                <Flex>
                    <Row style={Styles.alignStart}>
                        <Flex>
                            <Column>
                                <Text style={Styles.bold}>Immunisation Date</Text>
                            </Column>
                        </Flex>
                        <Flex>
                            <Column>
                                <Text style={Styles.bold}>Immunisation Type</Text>
                            </Column>
                        </Flex>
                    </Row>
                    <Row>
                        <Flex>
                            <Column>
                                <Text>{moment(immunisationDate).format('MMM D, YYYY')}</Text>
                            </Column>
                        </Flex>
                        <Flex>
                            <Column>
                                <Text>{`${Constants.immunisationCodes[codelist]}${codelist === 'OTHER' ? ` (${other})` : ''}`}</Text>
                            </Column>
                        </Flex>
                    </Row>
                </Flex>
                <Column>
                    <Row>
                        <TouchableOpacity style={Styles.buttonIcon} onPress={() => routeHelper.goINSImmunisation(this.props.navigator, item)}>
                            <FontAwesome style={[Styles.listItemIcon, {color: pallette.primary}]} name="pencil-square-o"/>
                        </TouchableOpacity>
                        <TouchableOpacity style={[Styles.buttonIcon, Styles.ml10, {paddingBottom: 4}]} onPress={() => this.deleteImmunisation(id)}>
                            <FontAwesome style={[Styles.listItemIcon, {color: colour.danger}]} name="trash"/>
                        </TouchableOpacity>
                    </Row>
                </Column>
            </Row>
        );
    }

    render() {
        const {isLoading, immunisations} = this.state;
        return isLoading ?
            <Flex>
                <NetworkBar message="It seems you are offline, you need to be online to record a immunisation."/>
                <View style={Styles.centeredContainer}>
                    <Loader/>
                </View>
            </Flex>
            : (
                <Flex style={Styles.whiteContainer}>
                    <NetworkBar message="It seems you are offline, you need to be online to record a immunisation."/>

                    <Fade style={{flex: 1}} autostart value={true}>
                        <Flex style={Styles.container}>
                            <FormGroup>
                                <Column>
                                    <Button style={Styles.mb10} onPress={() => routeHelper.goINSImmunisation(this.props.navigator)}>
                                        Add
                                    </Button>
                                </Column>
                            </FormGroup>
                            {immunisations && !!immunisations.length ? (
                                <FlatList
                                    keyExtractor={item => item.id}
                                    data={immunisations || []}
                                    renderItem={this.renderRow}
                                />
                            ) : (
                                <Text style={Styles.center}>
                                    No immunisations records found
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
