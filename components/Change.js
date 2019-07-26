//Renders a component that displays indication of changing numbers

import React, {Component, PropTypes} from 'react';

const Change = class extends Component {
    displayName: 'Change'

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        const change = this.props.value || 0;
        if (!change) {
            //No Change
            return (
                <Text style={[styles.icon, styles.unchanged]}>
                    –
                </Text>
            )
        } else if (change > 0) {
            //Positive Change
            return (
                <Row>
                    <ION style={[styles.icon, styles.up]} name="ios-arrow-up"/>
                    <Text style={[styles.text, styles.up]}>
                        {change}
                    </Text>
                </Row>
            )
        } else {
            //Negative Change
            return (
                <Row>
                    <ION style={[styles.icon, styles.down]} name="ios-arrow-down"/>
                    <Text style={[styles.text, styles.down]}>
                       {(change+"").replace("-","")}
                    </Text>
                </Row>
            )
        }

    }
};

Change.propTypes = {
    change:OptionalNumber
};

var styles = StyleSheet.create({
    icon: {
        fontSize: em(1),
        width:em(0.8),
        color: "black"
    },
    unchanged: {
        width:em(1),
        textAlign:"center"
    },
    text: {
        color: "black",
        fontSize: em(.8)
    },
    up: {
        color: colour.success
    },
    down: {
        color: colour.danger
    }
});

module.exports = Change;