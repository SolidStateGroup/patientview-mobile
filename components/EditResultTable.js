//Displays a table of results which can be edited and removed

import React, {Component, PropTypes} from 'react';
const ACTION_WIDTH = 100;
const EditResultsTable = class extends Component {
    displayName: 'EditResultsTable';

    constructor(props, context) {
        super(props, context);
        this.state = {
            sort: "applies",
            asc: false
        }
    }


    toggle = (sort) => {
        this.setState({
            sort,
            asc: this.state.sort == sort ? !this.state.asc : true
        })
    };

    renderRow = ({item, index}) => {
        const {isConnected} = this.props;
        return ( //Table rows
            <Row style={[{height: 44}, index % 2 ? Styles.rowDefault : Styles.rowAlt]}>
                {/*Value*/}
                <View style={styles.valueTd}>
                    <Text style={Styles.rowText}>
                        {item.value}
                    </Text>
                </View>

                {/*Date*/}
                <Flex style={{alignItems: 'center'}}>
                    <Text style={[Styles.rowText, {textAlign: 'center'}]}>
                        {Format.moment(item.applies, "DD-MMM-YYYY HH:mm")}
                    </Text>
                </Flex>

                {/*Actions*/}
                <View style={{width: ACTION_WIDTH}}>
                    <Row style={{justifyContent: "center", height: 44, opacity: isConnected ? 1 : 0.5}}>
                        <TouchableOpacity
                            activeOpacity={isConnected ? 0.5 : 1}
                            style={{height: 44, justifyContent: "center"}}
                            onPress={() => isConnected && this.props.onEditPress && this.props.onEditPress(item)}>
                            <Column>
                                <FontAwesome style={[Styles.listItemIcon, {color: colour.primaryDark}]} name="pencil"/>
                            </Column>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={isConnected ? 0.5 : 1}
                            style={{height: 44, justifyContent: "center"}}
                            onPress={() => isConnected && this.props.onRemovePress && this.props.onRemovePress(item)}>
                            <Column>
                                <FontAwesome style={[Styles.listItemIcon, {color: colour.danger}]} name="trash"/>
                            </Column>
                        </TouchableOpacity>
                    </Row>
                </View>
            </Row>
        );
    };

    render() {
        let {results} = this.props;
        const {asc, sort} = this.state;
        return (
            <SortProvider items={results} asc={asc} sort={sort}>
                {(results) => (
                    <Fade style={{flex: 1}} autostart value={true}>
                        {/*Table Header*/}
                        <Row style={[Styles.whiteContainer, {height: 44}]}>

                            {/*Value*/}
                            <View style={[{alignItems: 'center'}, styles.valueTd]}>
                                <TouchableOpacity onPress={() => this.toggle("value")}>
                                    <Text style={Styles.bold}>
                                        Value
                                        {sort == "value" && (
                                            <SortIcon asc={asc}/>
                                        )}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/*Date*/}
                            <Flex style={{alignItems: 'center'}}>
                                <TouchableOpacity onPress={() => this.toggle("applies")}>
                                    <Text style={Styles.bold}>
                                        Date Taken
                                        {" "}
                                        {sort == "applies" && (
                                            <SortIcon asc={asc}/>
                                        )}
                                    </Text>
                                </TouchableOpacity>
                            </Flex>

                            {/*Actions*/}
                            <View style={{width: ACTION_WIDTH, alignItems: 'center'}}>
                                <Text style={Styles.bold}>
                                    Actions
                                </Text>
                            </View>
                        </Row>

                        {/*Table*/}
                        <FlatList
                            extraData={this.props}
                            data={results}
                            keyExtractor={(i) => i.logicalId}
                            renderItem={this.renderRow}
                        />
                    </Fade>
                )}
            </SortProvider>
        );
    }
};

EditResultsTable.propTypes = {
    onEditPress: RequiredFunc,
    onRemovePress: RequiredFunc,
    results: OptionalArray
};

var styles = StyleSheet.create({
    changeTd: {
        width: em(3.5),
        alignItems: "center"
    },
    valueTd: {
        width: em(4),
        alignItems: "center"
    },
});

module.exports = EditResultsTable;