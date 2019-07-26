import React, {Component, PropTypes} from 'react';

const ListItem = class extends Component {
    displayName: 'ListItem'

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        var content = (
            <Row>
                {this.props.icon}
                <View style={[this.props.disabled && Styles.listItemDisabled, Styles.liContent, { backgroundColor: 'transparent' }]}>
                    {this.props.children}
                </View>
            </Row>
        );
        return (
            this.props.onPress ?
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={this.props.disabled ? null : this.props.onPress}>
                    <View style={this.props.style || Styles.listItem}>
                        {content}
                    </View>
                </TouchableOpacity>
                : <View style={[this.props.style || Styles.listItem]}>{content}</View>
        );
    }
};

ListItem.propTypes = {};
ListItem.defaultProps =  {
    onPress: null,
    text: null,
    underlayColor: colour.inputBackground,
};;

module.exports = ListItem;