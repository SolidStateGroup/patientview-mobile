/**
 * Created by kylejohnson on 28/01/2017.
 */
import React, {Component, PropTypes} from 'react';
import MedicineStore from '../../common/stores/medicines-store';
const DATE_WIDTH = 110;
const SHORT_NAME_WIDTH = 100;
const REMAINING_SPACE = DeviceWidth - (DATE_WIDTH + SHORT_NAME_WIDTH);
const NAME_WIDTH = REMAINING_SPACE/2;
const DOSE_WIDTH = REMAINING_SPACE/2;
const TABLE_WIDTH = DATE_WIDTH + SHORT_NAME_WIDTH + REMAINING_SPACE;

//Medicine table header
const TH = (props)=>(
    <Row style={[Styles.thead, {height: 44}]}>
        <View style={[Styles.th, {width: DATE_WIDTH, paddingLeft: 10}]}>
            <TouchableOpacity onPress={()=>props.toggle("startDate")}>
                <Text numberOfLines={1} style={Styles.bold}>
                    Start Date
                    {" "}
                    {props.sort == "startDate" && (
                        <SortIcon asc={props.asc}/>
                    )}
                </Text>
            </TouchableOpacity>
        </View>
        <View style={[Styles.th, {width: NAME_WIDTH * props.zoom}]}>
            <TouchableOpacity onPress={()=>props.toggle("name")}>
                <Text style={Styles.bold}>
                    Name
                    {" "}
                    {props.sort == "name" && (
                        <SortIcon asc={props.asc}/>
                    )}
                </Text>
            </TouchableOpacity>
        </View>
        <View style={[Styles.th, {width: DOSE_WIDTH * props.zoom, paddingLeft: 10}]}>
            <TouchableOpacity onPress={()=>props.toggle("dose")}>
                <Text style={Styles.bold}>
                    Dose
                    {" "}
                    {props.sort == "dose" && (
                        <SortIcon asc={props.asc}/>
                    )}
                </Text>
            </TouchableOpacity>
        </View>
        <View style={[Styles.th, {width: SHORT_NAME_WIDTH, paddingLeft: 10}]}>
            <TouchableOpacity onPress={()=>props.toggle("shortName")}>
                <Text style={Styles.bold}>
                    Source
                    {" "}
                    {props.sort == "shortName" && (
                        <SortIcon asc={props.asc}/>
                    )}
                </Text>
            </TouchableOpacity>
        </View>
    </Row>
);


const OptIn = class extends Component {
    displayName: 'TheComponent'

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        const {hidden, optedIn, toggleOptIn, toggleHidden} = this.props
        return (
            <Container>
                {hidden ?
                    <Button style={{alignSelf: "center"}}
                            onPress={toggleHidden}>GP Medicines Opt In/Out</Button> : (
                    <View>
                        {optedIn ? (
                            <FormGroup
                                style={[Styles.alertSuccess, {flex: 0}]}>
                                <FormGroup>
                                    <Text>
                                        Medicines from your
                                        GP's records
                                        We need your
                                        explicit permission
                                        to access your
                                        GP's records of your
                                        medication. <Text
                                        onPress={()=>Linking.openURL("http://www.rixg.org/rpv/ecs-scr.html")}
                                        style={[Styles.anchor, {color: colour.primary}]}>(Explain This)</Text>
                                        You are currently
                                        opted in to show
                                        medicines
                                        from your GP record.
                                    </Text>
                                </FormGroup>
                                <FormGroup>
                                    <Row>
                                        <Button onPress={toggleOptIn}>
                                            Opt Out
                                        </Button>
                                        <Column>
                                            <TouchableOpacity
                                                onPress={toggleHidden}>
                                                <Text style={Styles.anchor}>
                                                    Hide
                                                    Notification
                                                </Text>
                                            </TouchableOpacity>
                                        </Column>
                                    </Row>
                                </FormGroup>
                            </FormGroup>
                        ) : (
                            <FormGroup
                                style={[Styles.alertWarn, {flex: 0}]}>
                                <FormGroup>
                                    <Text>
                                        Please click the Opt
                                        In button if you
                                        would like
                                        PatientView to
                                        display the
                                        prescription from
                                        your
                                        GP.
                                        This
                                        is useful as its
                                        usually the most up
                                        to date
                                        prescription.
                                        PatientView can now
                                        obtain it for you,
                                        with your
                                        permission,
                                        from your GP's
                                        records. <Text
                                        onPress={()=>Linking.openURL("http://www.rixg.org/rpv/ecs-scr.html")}
                                        style={[Styles.anchor, {color: colour.primary}]}>(Explain
                                        This)</Text>
                                    </Text>
                                </FormGroup>
                                <FormGroup>
                                    <Row>
                                        <Button onPress={toggleOptIn}>
                                            Opt In
                                        </Button>
                                    </Row>
                                </FormGroup>
                            </FormGroup>
                        )}
                    </View>
                )}
            </Container>
        );
    }
};

//Medicine row
const TR = (props)=>(
    <Row style={[Styles.whiteContainer, {minHeight: 64}]}>
        <View style={[Styles.td, {width: DATE_WIDTH}]}>
            <Text style={Styles.rowText}>
                {Format.moment(props.startDate, "DD-MMM-YYYY")}
            </Text>
        </View>
        <View style={[Styles.td, {width: NAME_WIDTH * props.zoom}]}>
            <Text style={Styles.rowText}>
                {props.name}
            </Text>
        </View>
        <View style={[Styles.td, {width: DOSE_WIDTH * props.zoom}]}>
            <Text style={Styles.rowText}>
                {props.dose}
            </Text>
        </View>
        <View style={[Styles.td, {width: SHORT_NAME_WIDTH}]}>
            <Text style={Styles.rowText}>
                {props.group.shortName}
            </Text>
        </View>
    </Row>
);

const MedicinesPage = class extends Component {

    static navigatorStyle = global.navbarStyle;

    constructor(props, context) {
        super(props, context);
        this.state = {
            zoom: 1,
            view: "UNIT",
            isLoading: true,
            sort: "startDate",
            asc: false,
            sortGP: "startDate",
            ascGP: false
        };
    }

    toggle = (sort)=> {
        this.setState({
            sort,
            asc: this.state.sort == sort ? !this.state.asc : true
        })
    };
    toggleGP = (sortGP)=> {
        this.setState({
            sortGP,
            ascGP: this.state.sortGP == sortGP ? !this.state.ascGP : true
        })
    };

    componentWillMount() {
        routeHelper.handleNavEvent(this.props.navigator, 'medicines', this.onNavigatorEvent);
        ES6Component(this);
        AppActions.getMedicines()
        AsyncStorage.getItem("opthide", (err, res)=> {
            if (res)
                this.setState({optHide: res == "true"});
        })
        this.listenTo(MedicineStore, 'change', ()=>this.setState({
            isLoading: MedicineStore.isLoading,
            optedIn: MedicineStore.isOptedIn()
        }));
    }

    onNavigatorEvent = (event) => {
        if (event.id == Constants.navEvents.SHOW) {
            Utils.recordScreenView('Medicines Screen');
        } else if (event.id == 'info') {
            routeHelper.showAboutMedicines(this.props.navigator)
        } else if (event.id == 'close') {
            this.props.navigator.dismissModal();
        }
    };

    toggleOptHide = () => {
        this.setState({optHide: !this.state.optHide})
        AsyncStorage.setItem("opthide", !this.state.optHide ? "true" : "false")
    }

    toggleOptIn = (val)=> {
        AsyncStorage.setItem("opthide", "true")
        AppActions.toggleOptIn();
        Utils.record(val ? "GP OPT In" : "GP OPT Out");

        this.setState({isLoading: true, optHide: true});
    }

    render() {
        const {isLoading} = this.state;
        const hasGPFeature = MedicineStore.canOptIn();
        const {asc, sort, ascGP, sortGP}= this.state;

        return (
            <Flex style={Styles.whiteContainer}>
                <NetworkBar/>
                <Flex style={[Styles.body]}>
                    <Flex>
                        {isLoading && !MedicineStore.getResults() ? (
                            <Flex style={Styles.centeredContainer}>
                                <Loader/>
                                <Text>Loading medicines data</Text>
                            </Flex>
                        ) : (
                            <Flex>
                                {hasGPFeature && (
                                    <FormGroup style={[Styles.greyContainer, {paddingBottom: 10}]}>
                                        <Column>
                                            <Row style={{justifyContent: 'center'}}>
                                                <Button
                                                    style={[Styles.buttonGroupLeft, {height: 34}, this.state.view !== "UNIT" && {backgroundColor: pallette.textWhite}]}
                                                    onPress={() => this.setState({view: "UNIT"})}>
                                                    <Text style={{
                                                        color: this.state.view == "UNIT" ? 'white' : colour.textLight
                                                    }}>Your Unit(s)</Text>
                                                </Button>

                                                <Button
                                                    style={[Styles.buttonGroupRight, {height: 34}, this.state.view == "UNIT" && {backgroundColor: pallette.textWhite}]}
                                                    onPress={() => this.setState({view: "GP"})}>
                                                    <Text style={{
                                                        color: this.state.view == "GP" ? 'white' : colour.textLight
                                                    }}>Your GP</Text>
                                                </Button>
                                            </Row>
                                        </Column>
                                        <FormGroup>
                                            <Column>
                                                <Row style={{paddingLeft: 20, paddingRight: 20}}>
                                                    <ION name="ios-search"
                                                         style={{fontSize: em(1.5), color: colour.primary}}>

                                                    </ION>
                                                    <Flex>
                                                        <Slider
                                                            step={0.2}
                                                            value={this.state.zoom}
                                                            minimumValue={1}
                                                            maximumValue={2}
                                                            onValueChange={(zoom)=>this.setState({zoom})}/>
                                                    </Flex>
                                                </Row>
                                            </Column>
                                        </FormGroup>
                                    </FormGroup>
                                )}
                                <Flex>
                                    {this.state.view == "UNIT" ? (
                                        <SortProvider items={MedicineStore.getResults() || []} asc={asc} sort={sort}>
                                            {(results)=>(
                                                <ScrollView horizontal>
                                                    <Flex style={{width: TABLE_WIDTH * this.state.zoom}}>
                                                        <TH zoom={this.state.zoom} asc={asc} sort={sort}
                                                            toggle={this.toggle}/>
                                                        {MedicineStore.getResults().length ? (
                                                            <FlatList
                                                                data={results}
                                                                keyExtractor={(l) => l.id}
                                                                renderItem={({item}) => <TR zoom={this.state.zoom}
                                                                                            key={item.id} {...item}/>}/>
                                                        ) : (
                                                            <Text style={Styles.center}>No Medicines Received</Text>
                                                        )}
                                                    </Flex>
                                                </ScrollView>
                                            )}
                                        </SortProvider>
                                    ) : (
                                        <Flex>
                                            {this.state.optedIn ? (
                                                <SortProvider items={MedicineStore.getGPResults() || []} asc={ascGP}
                                                              sort={sortGP}>
                                                    {(results)=>(
                                                            <ScrollView horizontal>
                                                                <Flex style={{width: TABLE_WIDTH * this.state.zoom}}>
                                                                <TH zoom={this.state.zoom} asc={ascGP} sort={sortGP}
                                                                    toggle={this.toggleGP}/>
                                                                {MedicineStore.getGPResults().length ? (
                                                                    <FlatList
                                                                        data={results}
                                                                        keyExtractor={(l) => l.id}
                                                                        ListFooterComponent={       <OptIn
                                                                            hidden={this.state.optHide}
                                                                            optedIn={this.state.optedIn}
                                                                            toggleOptIn={this.toggleOptIn}
                                                                            toggleHidden={this.toggleOptHide}
                                                                        />}
                                                                        renderItem={({item}) => <TR zoom={this.state.zoom}
                                                                                                     key={item.id} {...item}/>
                                                                        }/>
                                                                ) : (
                                                                    <View>
                                                                        <Text style={Styles.center}>No Medicines
                                                                            Received</Text>
                                                                        <OptIn
                                                                            hidden={this.state.optHide}
                                                                            optedIn={this.state.optedIn}
                                                                            toggleOptIn={this.toggleOptIn}
                                                                            toggleHidden={this.toggleOptHide}
                                                                        />
                                                                    </View>
                                                                )}
                                                                </Flex>
                                                            </ScrollView>
                                                    )}
                                                </SortProvider>
                                            ) : (
                                                <OptIn
                                                    hidden={this.state.optHide}
                                                    optedIn={this.state.optedIn}
                                                    toggleOptIn={this.toggleOptIn}
                                                    toggleHidden={this.toggleOptHide}
                                                />
                                            )}

                                        </Flex>
                                    ) }
                                </Flex>
                            </Flex>
                        )}
                    </Flex>
                </Flex>
            </Flex>
        )
    }
};

MedicinesPage.propTypes = {};


module.exports = MedicinesPage;