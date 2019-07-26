//Shows a table of result data with sorting

import React, {Component} from 'react';

const ResultTable = class extends Component {
    displayName: 'ResultTable';

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

    renderRow = ({item, index}) => ( //Table rows
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

            {/*Change*/}
            <View style={styles.changeTd}>
                <View>
                    <Change value={item.change && item.change.toFixed(2)}/>
                </View>
            </View>

            {/*Group name*/}
            <Flex style={{alignItems: 'center'}}>
                <Text style={Styles.rowText}>
                    {item.groupName}
                </Text>
            </Flex>
        </Row>
    );

    render() {
        let {results} = this.props;
        const {asc, sort} = this.state;
        return (
            <SortProvider items={results} asc={asc} sort={sort}>
                {(results) => (
                    <Fade style={{flex: 1}} autostart value={true}>

                        {/*/!*Table Header */}
                        <Row style={[Styles.whiteContainer, {height: 44}]}>

                            {/*Value*/}
                            <View style={[{alignItems: 'center'}, styles.valueTd]}>
                                <TouchableOpacity onPress={() => this.toggle("valueNum")}>
                                    <Text style={Styles.bold}>
                                        Value
                                        {sort == "valueNum" && (
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

                            {/*Change*/}
                            <View style={styles.changeTd}>
                                <Text>Change ±</Text>
                            </View>

                            {/*Group name*/}
                            <Flex style={{alignItems: 'center'}}>
                                <TouchableOpacity onPress={() => this.toggle("groupName")}>
                                    <Text style={Styles.bold}>
                                        Source
                                        {" "}
                                        {sort == "groupName" && (
                                            <SortIcon asc={asc}/>
                                        )}
                                    </Text>
                                </TouchableOpacity>
                            </Flex>

                        </Row>

                        {/*Table*/}
                        <FlatList
                            data={results}
                            keyExtractor={(i) => i.id}
                            renderItem={this.renderRow}
                        />
                    </Fade>
                )}
            </SortProvider>
        );
    }
};

ResultTable.propTypes = {
    results: OptionalArray
};

var styles = StyleSheet.create({
    changeTd: {
        width: em(10),
        alignItems: "center"
    },
    valueTd: {
        width: em(4),
        alignItems: "center"
    },
});

module.exports = ResultTable;