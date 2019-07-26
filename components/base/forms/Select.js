//Select List with search filtering
import React, {Component, PropTypes} from 'react';

const Select = class extends Component {
    displayName: 'Select'

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    isSelected = (i) => {
        const {multiple} = this.props;
        const value = this.props.value || [];
        const _value = multiple ? value : [value];
        if (this.props.find) {
            return this.props.find(i, _value)
        }
        return _.find(_value, i)
    };

    setItem = (i, selected) => {
        let {multiple, value, onChange} = this.props;
        if (multiple) {
            if (selected) {
                onChange((value || []).concat(i));
            } else {
                const index = _.findIndex(value, i);
                value.splice(index, 1);
                onChange(value);
            }
        } else {
            if (selected) {
                onChange(i);
            } else {
                onChange(null);
            }
        }

    };

    render() {
        const {renderRow, renderNoResults, filterItem, placeholder, style} = this.props;
        const {search} = this.state;
        let data = filterItem ? _.filter(this.props.items, (i) => (
            !search || filterItem(i, search)
        )) : this.props.items;


        return (
            <Flex style={[{style}, {paddingTop: styleVariables.paddingBase}]}>

                {
                    filterItem &&
                    (
                        <Column>
                            <FormGroup>

                                <TextInput placeholder={placeholder}
                                           onChangeText={(search) => this.setState({search: search.toLowerCase()})}/>
                            </FormGroup>
                            <FormGroup>

                                <Text style={[Styles.bold]}>
                                    {this.props.filterText}
                                </Text>
                            </FormGroup>
                        </Column>
                    )
                }
                <FormGroup>
                    {this.props.groups ? (
                        <ScrollView>
                            {_.map(this.state.groups, (data, name) => (
                                <View key={data.id}>
                                    <Text style={Styles.listItemNav}>{name}</Text>
                                    {
                                        data && data.length ? data.map((i) => {
                                            const isSelected = this.isSelected(i);
                                            const toggleItem = () => {
                                                this.setItem(i, !isSelected)
                                            };

                                            return renderRow(i, isSelected, toggleItem);
                                        }) : renderNoResults ? renderNoResults() :
                                            <FormGroup><Text style={Styles.center}>No Results Found for:
                                                <Bold>{search}</Bold></Text></FormGroup>
                                    }
                                </View>
                            ))}
                        </ScrollView>
                    ) : (
                        <ScrollView>
                            {
                                data && data.length ? data.map((i) => {
                                    const isSelected = this.isSelected(i);
                                    const toggleItem = () => {
                                        this.setItem(i, !isSelected)
                                    };

                                    return renderRow(i, isSelected, toggleItem);
                                }) : renderNoResults ? renderNoResults() :
                                    <FormGroup><Text style={Styles.center}>No Results Found for:
                                        <Bold>{search}</Bold></Text></FormGroup>
                            }
                        </ScrollView>
                    )}
                </FormGroup>
            </Flex>
        );
    }
};

Select.propTypes = {
    value: React.PropTypes.any,
    items: React.PropTypes.array,
    multiple: React.PropTypes.bool,
    filterItem: React.PropTypes.func,
    renderRow: React.PropTypes.func,
    placeholder: React.PropTypes.string,
};

module.exports = Select;
