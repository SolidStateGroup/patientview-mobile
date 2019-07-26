/**
 * Created by kylejohnson on 28/01/2017.
 */
import React, {Component, PropTypes} from 'react';
import LettersStore from '../../common/stores/letters-store';
import data from '../../common/data/_data'
//Medicine table header
const TH = (props)=>(
    <Row style={[Styles.thead, {height: 44}]}>
        <Flex style={{alignItems: 'flex-start', paddingLeft: 10}}>
            <TouchableOpacity onPress={()=>props.toggle("date")}>
                <Text style={[Styles.bold]}>
                    Date
                    {" "}
                    {props.sort == "date" && (
                        <SortIcon asc={props.asc}/>
                    )}
                </Text>

            </TouchableOpacity>
        </Flex>
        <Flex style={{alignItems: 'flex-start', padding: 5}}>
            <TouchableOpacity onPress={()=>props.toggle("type")}>
                <Text style={[Styles.bold]}>
                    Type
                    {" "}
                    {props.sort == "type" && (
                        <SortIcon asc={props.asc}/>
                    )}
                </Text>
            </TouchableOpacity>
        </Flex>
        <Flex style={{alignItems: 'flex-start', padding: 5}}>
            <TouchableOpacity onPress={()=>props.toggle("groupName")}>
                <Text style={[Styles.bold]}>
                    Source
                    {" "}
                    {props.sort == "groupName" && (
                        <SortIcon asc={props.asc}/>
                    )}
                </Text>
            </TouchableOpacity>
        </Flex>
        <View style={{width: 145, alignItems: 'flex-start'}}>
            <Text style={[Styles.bold]}>
                Actions
            </Text>
        </View>
    </Row>
);

//Medicine row
const TR = (props)=>(
    <Row style={[Styles.whiteContainer, {minHeight: 64}]}>
        <Flex style={{alignItems: 'flex-start', paddingLeft: 10}}>
            <Text style={Styles.rowText}>
                {Format.moment(props.date, "DD-MMM-YYYY")}
            </Text>
        </Flex>
        <Flex style={{alignItems: 'flex-start', padding: 5}}>
            <Text style={Styles.rowText}>
                {props.type}
            </Text>
        </Flex>
        <Flex style={{alignItems: 'flex-start', padding: 5}}>
            <Text style={Styles.rowText}>
                {props.group.name}
            </Text>
        </Flex>
        <View style={{width: 145, alignItems: 'flex-start'}}>
            <Row style={{justifyContent: 'flex-start'}}>
                <Button onPress={()=>props.onView(props)} style={{marginRight: 10}}>
                    View
                </Button>
                <Button style={{backgroundColor: colour.brandDanger}} onPress={()=>props.onDelete(props)}>
                    Delete
                </Button>
            </Row>
        </View>
    </Row>
);

const MedicinesPage = class extends Component {

    static navigatorStyle = global.navbarStyle;

    constructor(props, context) {
        super(props, context);
        this.state = {
            view: "UNIT",
            isLoading: true,
            sort: "date",
            asc: false
        };
    }

    componentWillMount() {
        routeHelper.handleNavEvent(this.props.navigator, 'conditions', this.onNavigatorEvent);
        ES6Component(this);
        AppActions.getLetters()
        this.listenTo(LettersStore, 'change', ()=>this.setState({
            isLoading: LettersStore.isLoading
        }));
    }

    onNavigatorEvent = (event) => {
        if (event.id == Constants.navEvents.SHOW) {
            Utils.recordScreenView('Letters Screen');
        } else if (event.id == 'info') {
            routeHelper.showAboutLetters(this.props.navigator)
        }
    };

    onDelete = (letter)=> {
        Alert.alert(
            'Delete Letter',
            'Are you sure you want to delete this letter? This action cannot be undone.',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {
                    text: 'OK', onPress: () => {
                    data.delete(`${Project.api}user/${AccountStore.getUserId()}/group/${letter.group.id}/letters/${letter.date}`)
                        .then(()=> {
                            alert("Your letter was deleted");
                            AppActions.getLetters();
                        })
                }


                },
            ],
            {cancelable: false}
        );
    }

    onView = (letter)=> {
        routeHelper.showLetterContent(this.props.navigator, letter)
    }

    toggle = (sort)=> {
        this.setState({
            sort,
            asc: this.state.sort == sort ? !this.state.asc : true
        })
    };

    render() {
        const {isLoading, sort, asc} = this.state;
        return (
            <Delay>
                <Flex style={Styles.whiteContainer}/>
                <Flex style={Styles.whiteContainer}>
                    <NetworkBar/>
                    <Flex style={[Styles.body]}>
                        <Flex>
                            {isLoading && !LettersStore.getResults() ? (
                                <Flex style={Styles.centeredContainer}>
                                    <Loader/>
                                    <Text>Loading letters</Text>
                                </Flex>
                            ) : (
                                <Flex>
                                    <Flex>
                                        <TH asc={asc} sort={sort} toggle={this.toggle}/>
                                        {LettersStore.getResults().length ? (
                                            <SortProvider items={LettersStore.getResults() || []} asc={asc}
                                                          sort={sort}>
                                                {(results)=>(
                                                    <FlatList
                                                        data={results}
                                                        keyExtractor={(l) => l.id}
                                                        renderItem={({item}) => <TR onView={this.onView}
                                                                                    onDelete={this.onDelete}
                                                                                    key={item.id} {...item}/>}/>
                                                )}
                                            </SortProvider>
                                        ) : (
                                            <Text style={[Styles.center, Styles.warning]}>No Letters Received</Text>
                                        )}
                                    </Flex>
                                </Flex>
                            )}
                        </Flex>
                    </Flex>
                </Flex>
            </Delay>
        )
    }
};

MedicinesPage.propTypes = {};


module.exports = MedicinesPage;